import { appendFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const RETENTION_DAYS = 7;
export const DAY_MS = 86_400_000;

const API_BASE_URL = 'https://api.cloudflare.com/client/v4';
// Cloudflare rejects Pages list requests above 25 deployments per page.
const DEPLOYMENTS_PER_PAGE = 25;
const MAX_PAGES = 500;
const DEFAULT_MAX_ATTEMPTS = 3;
const MAX_RETRY_DELAY_MS = 30_000;
const DEFAULT_CONFIG_PATH = fileURLToPath(
  new URL('./cloudflare-preview-inventory.json', import.meta.url),
);

const STATUS_TEXT: Record<number, string> = {
  400: 'Bad request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not found',
  409: 'Conflict',
  422: 'Unprocessable content',
  429: 'Too many requests',
  500: 'Internal server error',
  502: 'Bad gateway',
  503: 'Service unavailable',
  504: 'Gateway timeout',
};

export type AppKind = 'pages' | 'worker';
export type PreviewMechanism = 'pages-deployments' | 'none';

export type InventoryApp = {
  name: string;
  kind: AppKind;
  previewMechanism: PreviewMechanism;
  sourcePath: string;
  note?: string;
};

export type Inventory = {
  apps: InventoryApp[];
};

export type PagesDeployment = {
  id?: unknown;
  environment?: unknown;
  created_on?: unknown;
  deployment_trigger?: unknown;
  aliases?: unknown;
  [key: string]: unknown;
};

export type PreviewApi = {
  listPagesDeployments(projectName: string): Promise<PagesDeployment[]>;
  deletePagesDeployment(
    projectName: string,
    deploymentId: string,
  ): Promise<void>;
};

export type DeploymentClassification =
  | { action: 'delete'; reason: 'preview-older-than-retention' }
  | { action: 'retain'; reason: 'production' | 'within-retention' }
  | {
      action: 'skip';
      reason:
        | 'missing-deployment-id'
        | 'unknown-environment'
        | 'missing-created-on'
        | 'invalid-created-on';
    };

export type DecisionOutcome =
  'candidate' | 'deleted' | 'retained' | 'skipped' | 'failed';

export type Decision = {
  deploymentId: string;
  createdOn: string | null;
  branch: string | null;
  outcome: DecisionOutcome;
  reason: string;
};

export type AppReport = {
  app: InventoryApp;
  scanned: number;
  production: number;
  previews: number;
  candidates: number;
  deleted: number;
  retained: number;
  skipped: number;
  failed: number;
  decisions: Decision[];
  error?: string;
  limitation?: string;
};

export type CleanupReport = {
  dryRun: boolean;
  runStartedAt: string;
  cutoff: string;
  retentionDays: number;
  apps: AppReport[];
  failed: boolean;
};

export type CliOptions = {
  dryRun: boolean;
  configPath: string | undefined;
  nowMs: number | undefined;
  help: boolean;
};

export type FetchResponse = {
  status: number;
  ok: boolean;
  headers: { get(name: string): string | null };
  json(): Promise<unknown>;
};

export type FetchLike = (
  url: string,
  init: { method: string; headers: Record<string, string> },
) => Promise<FetchResponse>;

type Attempt<T> = { ok: true; value: T } | { ok: false; error: unknown };

type FetchOutcome =
  { ok: true; response: FetchResponse } | { ok: false; error: unknown };

type ListOutcome =
  { ok: true; deployments: PagesDeployment[] } | { ok: false; error: unknown };

type DeletionOutcome =
  | { kind: 'deleted' }
  | { kind: 'skipped'; reason: string }
  | { kind: 'failed'; reason: string };

export class CloudflareAuthError extends Error {
  constructor(status: number) {
    super(
      `Cloudflare rejected the credentials (HTTP ${status}). Check CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID. ` +
        'The token needs Pages Read and Pages Write for every project in scripts/cloudflare-preview-inventory.json.',
    );
    this.name = 'CloudflareAuthError';
  }
}

export class CloudflareRequestError extends Error {
  constructor(
    readonly status: number,
    readonly method: string,
    readonly path: string,
    readonly details: string,
  ) {
    const statusText = STATUS_TEXT[status];
    const outcome =
      status === 0
        ? 'failed after retries'
        : `failed with HTTP ${status}${statusText === undefined ? '' : ` (${statusText})`}`;
    super(`Cloudflare ${method} ${path} ${outcome}: ${details}`);
    this.name = 'CloudflareRequestError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPagesDeployment(value: unknown): value is PagesDeployment {
  return isRecord(value);
}

function nonEmptyString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== ''
    ? value.trim()
    : undefined;
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function attempt<T>(operation: () => T): Attempt<T> {
  try {
    return { ok: true, value: operation() };
  } catch (error) {
    return { ok: false, error };
  }
}

function validateApp(value: unknown, index: number): InventoryApp {
  if (!isRecord(value)) {
    throw new Error(`Inventory app at index ${index} must be an object.`);
  }

  const name = nonEmptyString(value.name);
  if (name === undefined) {
    throw new Error(`Inventory app at index ${index} needs a name.`);
  }

  const kind = value.kind;
  if (kind !== 'pages' && kind !== 'worker') {
    throw new Error(
      `Inventory app "${name}" has an unsupported kind. Use "pages" or "worker".`,
    );
  }

  const previewMechanism = value.previewMechanism;
  if (previewMechanism !== 'pages-deployments' && previewMechanism !== 'none') {
    throw new Error(
      `Inventory app "${name}" has an unsupported previewMechanism. Use "pages-deployments" or "none".`,
    );
  }

  if (kind === 'pages' && previewMechanism !== 'pages-deployments') {
    throw new Error(
      `Inventory app "${name}" is a Pages project, so previewMechanism must be "pages-deployments".`,
    );
  }
  if (kind === 'worker' && previewMechanism !== 'none') {
    throw new Error(
      `Inventory app "${name}" is a Worker. No Worker preview deletion API is supported yet, so previewMechanism must be "none".`,
    );
  }

  const sourcePath = nonEmptyString(value.sourcePath);
  if (sourcePath === undefined) {
    throw new Error(`Inventory app "${name}" needs a sourcePath.`);
  }

  const note = nonEmptyString(value.note);
  if (previewMechanism === 'none' && note === undefined) {
    throw new Error(
      `Inventory app "${name}" uses previewMechanism "none" and needs a note explaining why no cleanup is possible.`,
    );
  }

  return {
    name,
    kind,
    previewMechanism,
    sourcePath,
    ...(note === undefined ? {} : { note }),
  };
}

export function validateInventory(value: unknown): Inventory {
  if (!isRecord(value) || !Array.isArray(value.apps)) {
    throw new Error('Inventory must contain an apps array.');
  }
  if (value.apps.length === 0) {
    throw new Error('Inventory must register at least one app.');
  }

  const apps = value.apps.map(validateApp);
  const duplicate = apps.find(
    (app, index) =>
      apps.findIndex((candidate) => candidate.name === app.name) !== index,
  );
  if (duplicate !== undefined) {
    throw new Error(`Inventory has a duplicate app name "${duplicate.name}".`);
  }
  return { apps };
}

function readInventoryFile(path: string): string {
  try {
    return readFileSync(path, 'utf8');
  } catch (error) {
    throw new Error(
      `Cannot read Cloudflare preview inventory at ${path}: ${messageOf(error)}`,
      { cause: error },
    );
  }
}

function parseInventoryJson(contents: string, path: string): unknown {
  try {
    return JSON.parse(contents);
  } catch (error) {
    throw new Error(
      `Cloudflare preview inventory at ${path} is not valid JSON: ${messageOf(error)}`,
      { cause: error },
    );
  }
}

export function loadInventory(path: string): Inventory {
  return validateInventory(parseInventoryJson(readInventoryFile(path), path));
}

function parseArgsFrom(
  argv: string[],
  index: number,
  options: CliOptions,
): CliOptions {
  const argument = argv[index];
  if (argument === undefined) return options;

  const valueIndex = index + 1;
  switch (argument) {
    case '--dry-run':
      return parseArgsFrom(argv, valueIndex, { ...options, dryRun: true });
    case '--help':
    case '-h':
      return parseArgsFrom(argv, valueIndex, { ...options, help: true });
    case '--config': {
      const configPath = argv[valueIndex];
      if (configPath === undefined || configPath.startsWith('-')) {
        throw new Error('--config needs a file path.');
      }
      return parseArgsFrom(argv, valueIndex + 1, { ...options, configPath });
    }
    case '--now': {
      const value = argv[valueIndex];
      if (value === undefined) {
        throw new Error('--now needs an ISO-8601 timestamp.');
      }
      const nowMs = Date.parse(value);
      if (Number.isNaN(nowMs)) {
        throw new Error(
          `--now must be an ISO-8601 timestamp, received "${value}".`,
        );
      }
      return parseArgsFrom(argv, valueIndex + 1, { ...options, nowMs });
    }
    default:
      throw new Error(
        `Unknown argument "${argument}". Use --help for supported arguments.`,
      );
  }
}

export function parseArgs(argv: string[]): CliOptions {
  return parseArgsFrom(argv, 0, {
    dryRun: false,
    configPath: undefined,
    nowMs: undefined,
    help: false,
  });
}

export function cutoffFromRunStart(
  runStartedAtMs: number,
  retentionDays = RETENTION_DAYS,
): number {
  return runStartedAtMs - retentionDays * DAY_MS;
}

function branchOf(deployment: PagesDeployment): string | null {
  const trigger = deployment.deployment_trigger;
  if (!isRecord(trigger) || !isRecord(trigger.metadata)) return null;
  return nonEmptyString(trigger.metadata.branch) ?? null;
}

export function classifyDeployment(
  deployment: PagesDeployment,
  cutoffMs: number,
): DeploymentClassification {
  if (nonEmptyString(deployment.id) === undefined) {
    return { action: 'skip', reason: 'missing-deployment-id' };
  }

  if (deployment.environment === 'production') {
    return { action: 'retain', reason: 'production' };
  }
  if (deployment.environment !== 'preview') {
    return { action: 'skip', reason: 'unknown-environment' };
  }

  const createdAt = deployment.created_on;
  if (typeof createdAt !== 'string' || createdAt.trim() === '') {
    return { action: 'skip', reason: 'missing-created-on' };
  }
  const createdAtMs = Date.parse(createdAt);
  if (Number.isNaN(createdAtMs)) {
    return { action: 'skip', reason: 'invalid-created-on' };
  }

  return createdAtMs < cutoffMs
    ? { action: 'delete', reason: 'preview-older-than-retention' }
    : { action: 'retain', reason: 'within-retention' };
}

function extractErrorMessages(body: unknown): string {
  if (isRecord(body) && Array.isArray(body.errors)) {
    const messages = body.errors
      .map((error) =>
        isRecord(error) ? nonEmptyString(error.message) : undefined,
      )
      .filter((message): message is string => message !== undefined);
    if (messages.length > 0) return messages.join('; ');
  }
  return 'Cloudflare returned an unsuccessful response.';
}

function retryDelayMs(attemptNumber: number, response: FetchResponse): number {
  const retryAfter = Number(response.headers.get('Retry-After'));
  if (Number.isFinite(retryAfter) && retryAfter >= 0) {
    return Math.min(retryAfter * 1000, MAX_RETRY_DELAY_MS);
  }
  return Math.min(500 * 2 ** (attemptNumber - 1), MAX_RETRY_DELAY_MS);
}

const defaultFetch: FetchLike = (url, init) => globalThis.fetch(url, init);

export type CloudflareApiOptions = {
  accountId: string;
  token: string;
  fetch?: FetchLike;
  sleep?: (milliseconds: number) => Promise<void>;
  baseUrl?: string;
  maxAttempts?: number;
};

export class CloudflareApi implements PreviewApi {
  private readonly accountId: string;
  private readonly token: string;
  private readonly fetch: FetchLike;
  private readonly sleep: (milliseconds: number) => Promise<void>;
  private readonly baseUrl: string;
  private readonly maxAttempts: number;

  constructor(options: CloudflareApiOptions) {
    this.accountId = options.accountId;
    this.token = options.token;
    this.fetch = options.fetch ?? defaultFetch;
    this.sleep =
      options.sleep ??
      ((milliseconds) =>
        new Promise((resolveSleep) => setTimeout(resolveSleep, milliseconds)));
    this.baseUrl = options.baseUrl ?? API_BASE_URL;
    this.maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  }

  private async send(
    method: 'GET' | 'DELETE',
    path: string,
  ): Promise<{ status: number; body: unknown }> {
    return this.sendAttempt(method, path, 1);
  }

  private async sendAttempt(
    method: 'GET' | 'DELETE',
    path: string,
    attemptNumber: number,
  ): Promise<{ status: number; body: unknown }> {
    const url = `${this.baseUrl}${path}`;
    const outcome: FetchOutcome = await this.fetch(url, {
      method,
      headers: { Authorization: `Bearer ${this.token}` },
    }).then(
      (response): FetchOutcome => ({ ok: true, response }),
      (error): FetchOutcome => ({ ok: false, error }),
    );

    if (!outcome.ok) {
      if (attemptNumber < this.maxAttempts) {
        await this.sleep(
          Math.min(500 * 2 ** (attemptNumber - 1), MAX_RETRY_DELAY_MS),
        );
        return this.sendAttempt(method, path, attemptNumber + 1);
      }
      throw new CloudflareRequestError(
        0,
        method,
        path,
        `network error: ${messageOf(outcome.error)}`,
      );
    }

    const response = outcome.response;
    const body = await response.json().catch(() => undefined);

    if (response.status === 401 || response.status === 403) {
      throw new CloudflareAuthError(response.status);
    }
    if (response.status === 429 || response.status >= 500) {
      if (attemptNumber < this.maxAttempts) {
        await this.sleep(retryDelayMs(attemptNumber, response));
        return this.sendAttempt(method, path, attemptNumber + 1);
      }
      throw new CloudflareRequestError(
        response.status,
        method,
        path,
        extractErrorMessages(body),
      );
    }

    return { status: response.status, body };
  }

  async listPagesDeployments(projectName: string): Promise<PagesDeployment[]> {
    return this.listDeploymentPage(projectName, 1, []);
  }

  private async listDeploymentPage(
    projectName: string,
    page: number,
    collected: PagesDeployment[],
  ): Promise<PagesDeployment[]> {
    const path =
      `/accounts/${encodeURIComponent(this.accountId)}` +
      `/pages/projects/${encodeURIComponent(projectName)}` +
      `/deployments?page=${page}&per_page=${DEPLOYMENTS_PER_PAGE}`;

    if (page > MAX_PAGES) {
      throw new CloudflareRequestError(
        0,
        'GET',
        path,
        `Pagination exceeded ${MAX_PAGES} pages; refusing to continue.`,
      );
    }

    const { status, body } = await this.send('GET', path);
    if (status < 200 || status >= 300) {
      throw new CloudflareRequestError(
        status,
        'GET',
        path,
        extractErrorMessages(body),
      );
    }
    if (
      !isRecord(body) ||
      body.success !== true ||
      !Array.isArray(body.result)
    ) {
      throw new CloudflareRequestError(
        status,
        'GET',
        path,
        extractErrorMessages(body),
      );
    }

    const pageDeployments = body.result.filter(isPagesDeployment);
    const accumulated = [...collected, ...pageDeployments];
    const resultInfo = isRecord(body.result_info)
      ? body.result_info
      : undefined;
    const totalPages = resultInfo?.total_pages;
    const hasMore =
      typeof totalPages === 'number'
        ? page < totalPages
        : pageDeployments.length === DEPLOYMENTS_PER_PAGE;

    if (!hasMore) return accumulated;
    return this.listDeploymentPage(projectName, page + 1, accumulated);
  }

  async deletePagesDeployment(
    projectName: string,
    deploymentId: string,
  ): Promise<void> {
    const path =
      `/accounts/${encodeURIComponent(this.accountId)}` +
      `/pages/projects/${encodeURIComponent(projectName)}` +
      `/deployments/${encodeURIComponent(deploymentId)}?force=true`;
    const { status, body } = await this.send('DELETE', path);

    if (status < 200 || status >= 300) {
      throw new CloudflareRequestError(
        status,
        'DELETE',
        path,
        extractErrorMessages(body),
      );
    }
    if (isRecord(body) && body.success === false) {
      throw new CloudflareRequestError(
        status,
        'DELETE',
        path,
        extractErrorMessages(body),
      );
    }
  }
}

function isProviderProtected(message: string): boolean {
  return /alias|latest deployment|protected/i.test(message);
}

export type CleanupOptions = {
  inventory: Inventory;
  runStartedAtMs: number;
  api: PreviewApi;
  dryRun?: boolean;
  retentionDays?: number;
};

function emptyAppReport(app: InventoryApp): AppReport {
  return {
    app,
    scanned: 0,
    production: 0,
    previews: 0,
    candidates: 0,
    deleted: 0,
    retained: 0,
    skipped: 0,
    failed: 0,
    decisions: [],
  };
}

function withDecision(report: AppReport, decision: Decision): AppReport {
  return { ...report, decisions: [...report.decisions, decision] };
}

async function deleteCandidate(
  api: PreviewApi,
  projectName: string,
  deploymentId: string,
): Promise<DeletionOutcome> {
  return api.deletePagesDeployment(projectName, deploymentId).then(
    (): DeletionOutcome => ({ kind: 'deleted' }),
    (error): DeletionOutcome => {
      if (error instanceof CloudflareAuthError) throw error;

      if (error instanceof CloudflareRequestError && error.status === 404) {
        return { kind: 'skipped', reason: 'already-deleted' };
      }
      if (
        error instanceof CloudflareRequestError &&
        (error.status === 400 ||
          error.status === 409 ||
          error.status === 423) &&
        isProviderProtected(error.details)
      ) {
        return {
          kind: 'skipped',
          reason: `provider-protected: ${error.details}`,
        };
      }
      return {
        kind: 'failed',
        reason:
          error instanceof CloudflareRequestError
            ? `HTTP ${error.status}: ${error.details}`
            : messageOf(error),
      };
    },
  );
}

async function applyDeployment(
  report: AppReport,
  deployment: PagesDeployment,
  options: CleanupOptions,
  cutoffMs: number,
): Promise<AppReport> {
  const classification = classifyDeployment(deployment, cutoffMs);
  const decisionBase = {
    deploymentId: nonEmptyString(deployment.id) ?? 'unknown-deployment-id',
    createdOn: nonEmptyString(deployment.created_on) ?? null,
    branch: branchOf(deployment),
  };
  const counted = {
    ...report,
    scanned: report.scanned + 1,
    production:
      report.production + (deployment.environment === 'production' ? 1 : 0),
    previews: report.previews + (deployment.environment === 'preview' ? 1 : 0),
  };

  if (classification.action === 'retain') {
    return withDecision(
      { ...counted, retained: counted.retained + 1 },
      {
        ...decisionBase,
        outcome: 'retained',
        reason: classification.reason,
      },
    );
  }
  if (classification.action === 'skip') {
    return withDecision(
      { ...counted, skipped: counted.skipped + 1 },
      {
        ...decisionBase,
        outcome: 'skipped',
        reason: classification.reason,
      },
    );
  }

  const candidateReport = {
    ...counted,
    candidates: counted.candidates + 1,
  };
  if (options.dryRun === true) {
    return withDecision(candidateReport, {
      ...decisionBase,
      outcome: 'candidate',
      reason: classification.reason,
    });
  }

  const outcome = await deleteCandidate(
    options.api,
    report.app.name,
    decisionBase.deploymentId,
  );
  if (outcome.kind === 'deleted') {
    return withDecision(
      { ...candidateReport, deleted: candidateReport.deleted + 1 },
      {
        ...decisionBase,
        outcome: 'deleted',
        reason: 'preview-older-than-retention',
      },
    );
  }
  if (outcome.kind === 'skipped') {
    return withDecision(
      { ...candidateReport, skipped: candidateReport.skipped + 1 },
      {
        ...decisionBase,
        outcome: 'skipped',
        reason: outcome.reason,
      },
    );
  }
  return withDecision(
    { ...candidateReport, failed: candidateReport.failed + 1 },
    {
      ...decisionBase,
      outcome: 'failed',
      reason: outcome.reason,
    },
  );
}

async function applyDeployments(
  report: AppReport,
  deployments: PagesDeployment[],
  index: number,
  options: CleanupOptions,
  cutoffMs: number,
): Promise<AppReport> {
  const deployment = deployments[index];
  if (deployment === undefined) return report;

  const next = await applyDeployment(report, deployment, options, cutoffMs);
  return applyDeployments(next, deployments, index + 1, options, cutoffMs);
}

async function buildAppReport(
  app: InventoryApp,
  options: CleanupOptions,
  cutoffMs: number,
): Promise<AppReport> {
  const report = emptyAppReport(app);

  if (app.previewMechanism === 'none') {
    return {
      ...report,
      limitation:
        app.note ??
        'No supported preview deletion mechanism is registered for this app.',
    };
  }

  const listed: ListOutcome = await options.api
    .listPagesDeployments(app.name)
    .then(
      (deployments): ListOutcome => ({ ok: true, deployments }),
      (error): ListOutcome => ({ ok: false, error }),
    );

  if (!listed.ok) {
    if (listed.error instanceof CloudflareAuthError) throw listed.error;
    return { ...report, error: messageOf(listed.error) };
  }

  return applyDeployments(report, listed.deployments, 0, options, cutoffMs);
}

async function buildAppReports(
  apps: InventoryApp[],
  index: number,
  reports: AppReport[],
  options: CleanupOptions,
  cutoffMs: number,
): Promise<AppReport[]> {
  const app = apps[index];
  if (app === undefined) return reports;

  const report = await buildAppReport(app, options, cutoffMs);
  return buildAppReports(
    apps,
    index + 1,
    [...reports, report],
    options,
    cutoffMs,
  );
}

export async function cleanupPreviews(
  options: CleanupOptions,
): Promise<CleanupReport> {
  const retentionDays = options.retentionDays ?? RETENTION_DAYS;
  const cutoffMs = cutoffFromRunStart(options.runStartedAtMs, retentionDays);
  const reports = await buildAppReports(
    options.inventory.apps,
    0,
    [],
    options,
    cutoffMs,
  );

  return {
    dryRun: options.dryRun === true,
    runStartedAt: new Date(options.runStartedAtMs).toISOString(),
    cutoff: new Date(cutoffMs).toISOString(),
    retentionDays,
    apps: reports,
    failed: reports.some(
      (report) => report.error !== undefined || report.failed > 0,
    ),
  };
}

function escapeCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
}

export function renderSummary(report: CleanupReport): string {
  const appRows = report.apps.map(
    (app) =>
      `| ${escapeCell(app.app.name)} | ${app.app.kind} | ${app.app.previewMechanism} | ${app.scanned} | ${app.previews} | ${app.candidates} | ${app.deleted} | ${app.retained} | ${app.skipped} | ${app.failed} |`,
  );

  const limitations = report.apps.filter((app) => app.limitation !== undefined);
  const limitationLines =
    limitations.length === 0
      ? []
      : [
          '',
          '### Unsupported or unresolved preview mechanisms',
          '',
          '| App | Mechanism | Limitation |',
          '| --- | --- | --- |',
          ...limitations.map(
            (app) =>
              `| ${escapeCell(app.app.name)} | ${app.app.previewMechanism} | ${escapeCell(app.limitation ?? '')} |`,
          ),
        ];

  const errors = report.apps.filter((app) => app.error !== undefined);
  const errorLines =
    errors.length === 0
      ? []
      : [
          '',
          '### Errors',
          '',
          '| App | Error |',
          '| --- | --- |',
          ...errors.map(
            (app) =>
              `| ${escapeCell(app.app.name)} | ${escapeCell(app.error ?? '')} |`,
          ),
        ];

  const audited = report.apps.flatMap((app) =>
    app.decisions
      .filter((decision) => decision.outcome !== 'retained')
      .map((decision) => ({ app: app.app.name, decision })),
  );
  const auditLines =
    audited.length === 0
      ? []
      : [
          '',
          '### Decisions requiring review',
          '',
          '| App | Deployment | Created (UTC) | Branch | Outcome | Reason |',
          '| --- | --- | --- | --- | --- | --- |',
          ...audited.map(
            ({ app, decision }) =>
              `| ${escapeCell(app)} | ${escapeCell(decision.deploymentId)} | ${decision.createdOn ?? 'unknown'} | ${escapeCell(decision.branch ?? 'unknown')} | ${decision.outcome} | ${escapeCell(decision.reason)} |`,
          ),
        ];

  return [
    report.dryRun
      ? '## Cloudflare preview cleanup — Dry run (no deletions issued)'
      : '## Cloudflare preview cleanup',
    '',
    `**Result:** ${report.failed ? 'FAILED' : 'PASSED'}`,
    '',
    '| Limit | Value |',
    '| --- | --- |',
    `| Run started (UTC) | ${report.runStartedAt} |`,
    `| Cutoff (UTC) | ${report.cutoff} |`,
    `| Retention | ${report.retentionDays} days |`,
    `| Mode | ${report.dryRun ? 'Dry run — candidates listed, nothing deleted' : 'Live cleanup'} |`,
    '',
    'Deployments are eligible only when Cloudflare reports `environment: preview` and `created_on` strictly earlier than the cutoff. Production deployments are always retained.',
    '',
    '| App | Kind | Mechanism | Scanned | Previews | Candidates | Deleted | Retained | Skipped | Failed |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...appRows,
    ...limitationLines,
    ...errorLines,
    ...auditLines,
    '',
  ].join('\n');
}

const USAGE = `Delete repository-owned Cloudflare preview deployments older than ${RETENTION_DAYS} days.

Usage:
  bun scripts/cloudflare-preview-cleanup.ts [--dry-run] [--config <path>] [--now <ISO-8601>]

Options:
  --dry-run        List eligible candidates without deleting anything.
  --config <path>  Read the app inventory from another JSON file.
  --now <time>     Use a fixed run-start time. For local verification only.
  --help           Show this help.

Required environment:
  CLOUDFLARE_ACCOUNT_ID   Cloudflare account that owns the configured apps.
  CLOUDFLARE_API_TOKEN    Scoped token with Pages Read and Pages Write.

The scheduled workflow runs live cleanup. Use --dry-run to inspect candidates first.`;

type LogEntry = { level: 'warning' | 'error'; message: string };

function logEntry(level: LogEntry['level'], message: string): LogEntry {
  return { level, message };
}

function printWarnings(report: CleanupReport): void {
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
  const entries = report.apps.flatMap((app): LogEntry[] => [
    ...(app.limitation === undefined
      ? []
      : [logEntry('warning', `${app.app.name}: ${app.limitation}`)]),
    ...(app.error === undefined
      ? []
      : [logEntry('error', `${app.app.name}: ${app.error}`)]),
  ]);

  entries.map((entry) =>
    entry.level === 'warning'
      ? console.warn(
          isGitHubActions
            ? `::warning::${entry.message}`
            : `warning: ${entry.message}`,
        )
      : console.error(
          isGitHubActions
            ? `::error::${entry.message}`
            : `error: ${entry.message}`,
        ),
  );
}

export async function main(
  argv: string[],
  environment: Record<string, string | undefined> = process.env,
): Promise<number> {
  const parsed = attempt(() => parseArgs(argv));
  if (!parsed.ok) {
    console.error(messageOf(parsed.error));
    return 1;
  }
  const options = parsed.value;

  if (options.help) {
    console.log(USAGE);
    return 0;
  }

  const accountId = nonEmptyString(environment.CLOUDFLARE_ACCOUNT_ID);
  const token = nonEmptyString(environment.CLOUDFLARE_API_TOKEN);
  if (accountId === undefined || token === undefined) {
    console.error(
      'CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN must be set. The token needs Pages Read and Pages Write.',
    );
    return 1;
  }

  const loaded = attempt(() =>
    loadInventory(
      options.configPath === undefined
        ? DEFAULT_CONFIG_PATH
        : resolve(process.cwd(), options.configPath),
    ),
  );
  if (!loaded.ok) {
    console.error(messageOf(loaded.error));
    return 1;
  }

  const report = await cleanupPreviews({
    inventory: loaded.value,
    runStartedAtMs: options.nowMs ?? Date.now(),
    api: new CloudflareApi({ accountId, token }),
    dryRun: options.dryRun,
  });

  const summary = renderSummary(report);
  console.log(summary);
  printWarnings(report);

  const summaryPath = nonEmptyString(environment.GITHUB_STEP_SUMMARY);
  if (summaryPath !== undefined) {
    appendFileSync(summaryPath, summary);
  }

  return report.failed ? 1 : 0;
}

if (import.meta.main) {
  main(process.argv.slice(2))
    .then((exitCode) => {
      process.exitCode = exitCode;
    })
    .catch((error: unknown) => {
      console.error(messageOf(error));
      process.exitCode = 1;
    });
}
