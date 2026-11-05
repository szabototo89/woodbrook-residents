import { expect, test } from 'bun:test';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

import {
  CloudflareApi,
  CloudflareAuthError,
  CloudflareRequestError,
  classifyDeployment,
  cleanupPreviews,
  cutoffFromRunStart,
  loadInventory,
  parseArgs,
  renderSummary,
  validateInventory,
  type Inventory,
  type PagesDeployment,
  type PreviewApi,
} from './cloudflare-preview-cleanup';

const repositoryRoot = resolve(import.meta.dir, '..');
const day = 86_400_000;
const runStartedAtMs = Date.UTC(2026, 9, 25, 2, 17, 0);

const inventory: Inventory = {
  apps: [
    {
      name: 'site-a',
      kind: 'pages',
      previewMechanism: 'pages-deployments',
      sourcePath: 'apps/site-a/wrangler.jsonc',
    },
    {
      name: 'site-b',
      kind: 'pages',
      previewMechanism: 'pages-deployments',
      sourcePath: 'apps/site-b/wrangler.jsonc',
    },
    {
      name: 'woodbrook-worker',
      kind: 'worker',
      previewMechanism: 'none',
      sourcePath: 'wrangler.jsonc',
      note: 'Worker versions have no supported deletion API.',
    },
  ],
};

type FakeApi = PreviewApi & {
  listed: string[];
  deleted: Array<{ project: string; deploymentId: string }>;
  state: {
    listError: Error | undefined;
    deleteError: Error | undefined;
  };
};

function fakeApi(projects: Record<string, PagesDeployment[]>): FakeApi {
  const listed: string[] = [];
  const deleted: Array<{ project: string; deploymentId: string }> = [];
  const state: FakeApi['state'] = {
    listError: undefined,
    deleteError: undefined,
  };

  const store: Record<string, PagesDeployment[]> = { ...projects };

  return {
    listed,
    deleted,
    state,
    async listPagesDeployments(project: string) {
      listed.push(project);
      if (state.listError !== undefined) throw state.listError;
      return store[project] ?? [];
    },
    async deletePagesDeployment(project: string, deploymentId: string) {
      if (state.deleteError !== undefined) throw state.deleteError;
      deleted.push({ project, deploymentId });
      store[project] = (store[project] ?? []).filter(
        (deployment) => deployment.id !== deploymentId,
      );
    },
  };
}

function preview(
  id: string,
  ageDays: number,
  overrides: Partial<PagesDeployment> = {},
): PagesDeployment {
  return {
    id,
    environment: 'preview',
    created_on: new Date(runStartedAtMs - ageDays * day).toISOString(),
    deployment_trigger: { metadata: { branch: `session/${id}` } },
    aliases: [`https://${id}.site-a.pages.dev`],
    ...overrides,
  };
}

function response(
  status: number,
  body: unknown,
  headers: Record<string, string> = {},
): {
  status: number;
  ok: boolean;
  headers: { get(name: string): string | null };
  json(): Promise<unknown>;
} {
  const responseHeaders = new Headers(headers);
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: responseHeaders,
    async json() {
      return body;
    },
  };
}

test('parses CLI arguments and rejects unknown flags', () => {
  expect(parseArgs([])).toEqual({
    dryRun: false,
    configPath: undefined,
    nowMs: undefined,
    help: false,
  });
  expect(parseArgs(['--dry-run']).dryRun).toBe(true);
  expect(parseArgs(['--config', 'custom.json']).configPath).toBe('custom.json');
  expect(parseArgs(['--now', '2026-10-25T02:17:00.000Z']).nowMs).toBe(
    runStartedAtMs,
  );
  expect(parseArgs(['--help']).help).toBe(true);
  expect(() => parseArgs(['--force'])).toThrow('Unknown argument');
  expect(() => parseArgs(['--now', 'not-a-date'])).toThrow('--now');
});

test('uses a single run-start cutoff strictly seven days earlier', () => {
  expect(cutoffFromRunStart(runStartedAtMs)).toBe(runStartedAtMs - 7 * day);
});

test('classifies production, old previews and newer previews', () => {
  const cutoff = cutoffFromRunStart(runStartedAtMs);

  expect(classifyDeployment(preview('old', 7.5), cutoff)).toEqual({
    action: 'delete',
    reason: 'preview-older-than-retention',
  });
  expect(classifyDeployment(preview('boundary', 7), cutoff)).toEqual({
    action: 'retain',
    reason: 'within-retention',
  });
  expect(classifyDeployment(preview('new', 1), cutoff)).toEqual({
    action: 'retain',
    reason: 'within-retention',
  });
  expect(
    classifyDeployment(
      preview('production', 90, { environment: 'production' }),
      cutoff,
    ),
  ).toEqual({ action: 'retain', reason: 'production' });
});

test('skips missing or unknown ownership and timestamp data', () => {
  const cutoff = cutoffFromRunStart(runStartedAtMs);

  expect(
    classifyDeployment(
      preview('missing-env', 8, { environment: undefined }),
      cutoff,
    ),
  ).toEqual({ action: 'skip', reason: 'unknown-environment' });
  expect(
    classifyDeployment(
      preview('staging', 8, { environment: 'staging' }),
      cutoff,
    ),
  ).toEqual({
    action: 'skip',
    reason: 'unknown-environment',
  });
  expect(
    classifyDeployment(
      preview('missing-time', 8, { created_on: undefined }),
      cutoff,
    ),
  ).toEqual({ action: 'skip', reason: 'missing-created-on' });
  expect(
    classifyDeployment(
      preview('bad-time', 8, { created_on: 'yesterday' }),
      cutoff,
    ),
  ).toEqual({ action: 'skip', reason: 'invalid-created-on' });
  expect(
    classifyDeployment({ environment: 'preview', created_on: '' }, cutoff),
  ).toEqual({ action: 'skip', reason: 'missing-deployment-id' });
});

test('deletes only old previews and retains production and newer previews', async () => {
  const api = fakeApi({
    'site-a': [
      preview('old-preview', 30),
      preview('new-preview', 2),
      preview('production', 40, { environment: 'production' }),
      preview('unknown-environment', 20, { environment: 'staging' }),
      preview('missing-timestamp', 20, { created_on: undefined }),
    ],
    'site-b': [preview('old-site-b', 9)],
  });

  const report = await cleanupPreviews({
    inventory,
    runStartedAtMs,
    api,
  });

  expect(report.failed).toBe(false);
  expect(api.deleted).toEqual([
    { project: 'site-a', deploymentId: 'old-preview' },
    { project: 'site-b', deploymentId: 'old-site-b' },
  ]);
  expect(api.listed).toEqual(['site-a', 'site-b']);

  const siteA = report.apps.find((app) => app.app.name === 'site-a');
  expect(siteA).toMatchObject({
    scanned: 5,
    production: 1,
    previews: 3,
    candidates: 1,
    deleted: 1,
    retained: 2,
    skipped: 2,
    failed: 0,
  });
});

test('retains a preview created exactly seven days before the run', async () => {
  const api = fakeApi({
    'site-a': [preview('boundary', 7), preview('just-older', 7 + 1 / 86_400)],
  });

  const report = await cleanupPreviews({
    inventory,
    runStartedAtMs,
    api,
  });

  expect(api.deleted).toEqual([
    { project: 'site-a', deploymentId: 'just-older' },
  ]);
  expect(report.apps[0]?.retained).toBe(1);
});

test('reports the same candidates in a dry run without deleting', async () => {
  const api = fakeApi({
    'site-a': [preview('old-preview', 30), preview('new-preview', 1)],
  });

  const report = await cleanupPreviews({
    inventory,
    runStartedAtMs,
    api,
    dryRun: true,
  });

  expect(api.deleted).toEqual([]);
  expect(report.apps[0]).toMatchObject({
    candidates: 1,
    deleted: 0,
    retained: 1,
    failed: 0,
  });
  expect(report.apps[0]?.decisions).toContainEqual({
    deploymentId: 'old-preview',
    createdOn: new Date(runStartedAtMs - 30 * day).toISOString(),
    branch: 'session/old-preview',
    outcome: 'candidate',
    reason: 'preview-older-than-retention',
  });
  expect(renderSummary(report)).toContain('Dry run');
  expect(api.deleted).toEqual([]);
});

test('treats an already-deleted deployment as an idempotent skip', async () => {
  const api = fakeApi({ 'site-a': [preview('gone', 10)] });
  api.state.deleteError = new CloudflareRequestError(
    404,
    'DELETE',
    '/pages/projects/site-a/deployments/gone',
    'Deployment not found',
  );

  const report = await cleanupPreviews({
    inventory,
    runStartedAtMs,
    api,
  });

  expect(report.failed).toBe(false);
  expect(report.apps[0]?.skipped).toBe(1);
  expect(report.apps[0]?.decisions).toContainEqual(
    expect.objectContaining({
      deploymentId: 'gone',
      outcome: 'skipped',
      reason: 'already-deleted',
    }),
  );
});

test('records provider-protected aliases as explicit skips', async () => {
  const api = fakeApi({ 'site-a': [preview('aliased', 10)] });
  api.state.deleteError = new CloudflareRequestError(
    400,
    'DELETE',
    '/pages/projects/site-a/deployments/aliased',
    'Cannot delete a deployment that is currently aliased',
  );

  const report = await cleanupPreviews({
    inventory,
    runStartedAtMs,
    api,
  });

  expect(report.failed).toBe(false);
  expect(report.apps[0]?.skipped).toBe(1);
  expect(report.apps[0]?.decisions).toContainEqual(
    expect.objectContaining({
      outcome: 'skipped',
      reason: expect.stringContaining('provider-protected'),
    }),
  );
  expect(renderSummary(report)).toContain('provider-protected');
});

test('fails the run after a persistent deletion error', async () => {
  const api = fakeApi({ 'site-a': [preview('stuck', 10)] });
  api.state.deleteError = new CloudflareRequestError(
    500,
    'DELETE',
    '/pages/projects/site-a/deployments/stuck',
    'Internal error',
  );

  const report = await cleanupPreviews({
    inventory,
    runStartedAtMs,
    api,
  });

  expect(report.failed).toBe(true);
  expect(report.apps[0]?.failed).toBe(1);
  expect(report.apps[0]?.decisions).toContainEqual(
    expect.objectContaining({
      deploymentId: 'stuck',
      outcome: 'failed',
    }),
  );
});

test('keeps processing other apps after one list failure', async () => {
  const api = fakeApi({ 'site-b': [preview('old-site-b', 9)] });
  const originalList = api.listPagesDeployments.bind(api);
  api.listPagesDeployments = async (project: string) => {
    if (project === 'site-a') {
      throw new CloudflareRequestError(
        500,
        'GET',
        '/pages/projects/site-a/deployments',
        'Internal error',
      );
    }
    return originalList(project);
  };

  const report = await cleanupPreviews({
    inventory,
    runStartedAtMs,
    api,
  });

  expect(report.failed).toBe(true);
  expect(report.apps[0]?.error).toContain('Internal error');
  expect(report.apps[1]?.deleted).toBe(1);
});

test('surfaces authentication failures with actionable guidance', async () => {
  const api = fakeApi({});
  api.listPagesDeployments = async () => {
    throw new CloudflareAuthError(403);
  };

  await expect(
    cleanupPreviews({ inventory, runStartedAtMs, api }),
  ).rejects.toThrow('CLOUDFLARE_API_TOKEN');
});

test('reports an unsupported Worker preview mechanism as a limitation', async () => {
  const api = fakeApi({});

  const report = await cleanupPreviews({
    inventory,
    runStartedAtMs,
    api,
  });

  expect(api.listed).not.toContain('woodbrook-worker');
  expect(report.apps[2]).toMatchObject({
    scanned: 0,
    deleted: 0,
    failed: 0,
    limitation: 'Worker versions have no supported deletion API.',
  });
  expect(renderSummary(report)).toContain(
    'Worker versions have no supported deletion API.',
  );
});

test('paginates Pages deployment lists', async () => {
  const requests: string[] = [];
  const fetch = async (url: string) => {
    requests.push(url);
    const page = new URL(url).searchParams.get('page');
    if (page === '1') {
      return response(200, {
        success: true,
        result: [preview('one', 9), preview('two', 9)],
        result_info: { page: 1, per_page: 2, total_pages: 2 },
      });
    }
    return response(200, {
      success: true,
      result: [preview('three', 9)],
      result_info: { page: 2, per_page: 2, total_pages: 2 },
    });
  };
  const api = new CloudflareApi({
    accountId: 'account',
    token: 'secret-token',
    fetch,
    sleep: async () => {},
  });

  const deployments = await api.listPagesDeployments('site-a');

  expect(deployments.map((deployment) => deployment.id)).toEqual([
    'one',
    'two',
    'three',
  ]);
  expect(requests).toHaveLength(2);
  expect(requests[0]).toContain('per_page=25');
  expect(requests[1]).toContain('page=2');
});

test('retries rate limits and uses force when deleting an aliased preview', async () => {
  const requests: Array<{ url: string; method: string }> = [];
  const listAttempts = { count: 0 };
  const fetch = async (url: string, init?: { method?: string }) => {
    requests.push({ url, method: init?.method ?? 'GET' });
    if (init?.method === 'DELETE') {
      return response(200, { success: true, result: {} });
    }
    listAttempts.count += 1;
    if (listAttempts.count === 1) {
      return response(429, {}, { 'Retry-After': '0' });
    }
    return response(200, { success: true, result: [] });
  };
  const api = new CloudflareApi({
    accountId: 'account',
    token: 'secret-token',
    fetch,
    sleep: async () => {},
  });

  await api.listPagesDeployments('site-a');
  await api.deletePagesDeployment('site-a', 'deployment-id');

  expect(listAttempts.count).toBe(2);
  const deletion = requests.find((request) => request.method === 'DELETE');
  expect(deletion?.url).toContain(
    '/accounts/account/pages/projects/site-a/deployments/deployment-id',
  );
  expect(deletion?.url).toContain('force=true');
});

test('gives up after bounded retries for transient API errors', async () => {
  const attempts = { count: 0 };
  const fetch = async () => {
    attempts.count += 1;
    return response(500, {
      success: false,
      errors: [{ message: 'unavailable' }],
    });
  };
  const api = new CloudflareApi({
    accountId: 'account',
    token: 'secret-token',
    fetch,
    sleep: async () => {},
  });

  await expect(api.listPagesDeployments('site-a')).rejects.toThrow(
    'Internal server error',
  );
  expect(attempts.count).toBe(3);
});

test('does not put the API token in errors', async () => {
  const api = new CloudflareApi({
    accountId: 'account',
    token: 'super-secret-token',
    fetch: async () => {
      throw new Error('network down');
    },
    sleep: async () => {},
  });

  const error = await api
    .listPagesDeployments('site-a')
    .catch((thrown: unknown) => thrown);
  expect(error).toBeInstanceOf(Error);
  const message = error instanceof Error ? error.message : '';
  expect(message).toContain('network down');
  expect(message).not.toContain('super-secret-token');
});

test('summarises counts, cutoff and decisions without secrets', async () => {
  const api = fakeApi({
    'site-a': [
      preview('old-preview', 30),
      preview('new-preview', 2),
      preview('staging', 20, { environment: 'staging' }),
    ],
  });

  const report = await cleanupPreviews({ inventory, runStartedAtMs, api });
  const summary = renderSummary(report);

  expect(summary).toContain('2026-10-18T02:17:00.000Z');
  expect(summary).toContain('| site-a | pages | pages-deployments | 3 | 2 |');
  expect(summary).toContain('old-preview');
  expect(summary).toContain('unknown-environment');
  expect(summary).not.toContain('secret-token');
});

test('a repeated run is safe when the old deployment is already gone', async () => {
  const api = fakeApi({ 'site-a': [preview('old-preview', 30)] });

  const first = await cleanupPreviews({ inventory, runStartedAtMs, api });
  const second = await cleanupPreviews({ inventory, runStartedAtMs, api });

  expect(first.apps[0]?.deleted).toBe(1);
  expect(second.apps[0]?.deleted).toBe(0);
  expect(second.failed).toBe(false);
});

test('validates the inventory and rejects unsafe registrations', () => {
  expect(validateInventory(inventory)).toEqual(inventory);
  expect(() => validateInventory({ apps: [] })).toThrow('at least one app');
  expect(() =>
    validateInventory({
      apps: [inventory.apps[0], { ...inventory.apps[0], sourcePath: 'other' }],
    }),
  ).toThrow('duplicate');
  expect(() =>
    validateInventory({
      apps: [{ ...inventory.apps[0], kind: 'worker' }],
    }),
  ).toThrow('previewMechanism');
  expect(() =>
    validateInventory({
      apps: [
        {
          ...inventory.apps[2],
          note: undefined,
        },
      ],
    }),
  ).toThrow('note');
  expect(() =>
    validateInventory({
      apps: [{ ...inventory.apps[0], previewMechanism: 'magic' }],
    }),
  ).toThrow('previewMechanism');
});

test('the cleanup workflow runs daily, serializes runs and supports dry runs', () => {
  const workflow = readFileSync(
    join(repositoryRoot, '.github/workflows/cleanup-cloudflare-previews.yml'),
    'utf8',
  );

  expect(workflow).toContain("cron: '17 2 * * *'");
  expect(workflow).toContain('workflow_dispatch:');
  expect(workflow).toContain('dry_run:');
  expect(workflow).toContain('group: cloudflare-preview-cleanup');
  expect(workflow).toContain('cancel-in-progress: false');
  expect(workflow).toContain('contents: read');
  expect(workflow).toContain(
    "bun scripts/cloudflare-preview-cleanup.ts ${{ inputs.dry_run && '--dry-run' || '' }}",
  );
});

test('the checked-in inventory covers every deployed Cloudflare app', () => {
  const inventoryPath = join(
    repositoryRoot,
    'scripts/cloudflare-preview-inventory.json',
  );
  expect(existsSync(inventoryPath)).toBe(true);

  const registered = loadInventory(inventoryPath).apps;
  const missingSources = registered.filter(
    (app) => !existsSync(join(repositoryRoot, app.sourcePath)),
  );
  expect(missingSources.map((app) => app.sourcePath)).toEqual([]);
  const registeredNames = registered.map((app) => app.name);

  const workflowDirectory = join(repositoryRoot, '.github/workflows');
  const workflowFiles = readdirSync(workflowDirectory).filter((file) =>
    file.startsWith('deploy-'),
  );
  const deployedProjects = workflowFiles.flatMap((file) => {
    const workflow = readFileSync(join(workflowDirectory, file), 'utf8');
    return [
      ...[...workflow.matchAll(/--project-name[= ]([a-z0-9-]+)/g)].map(
        (match) => match[1],
      ),
      ...[...workflow.matchAll(/^\s*-?\s*project:\s*([a-z0-9-]+)$/gm)].map(
        (match) => match[1],
      ),
    ].filter((name): name is string => name !== undefined);
  });

  const workerName = /^\s*"name":\s*"([^"]+)"/m.exec(
    readFileSync(join(repositoryRoot, 'wrangler.jsonc'), 'utf8'),
  )?.[1];
  if (workerName === undefined) {
    throw new Error('wrangler.jsonc must declare a Worker name');
  }

  expect([...deployedProjects, workerName].sort()).toEqual(
    [...registeredNames].sort(),
  );
});
