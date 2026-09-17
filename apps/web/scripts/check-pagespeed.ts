import { PRODUCTION_SITE_URL } from '../src/app/siteMetadata';
import { LIGHTHOUSE_MIN_SCORES, LIGHTHOUSE_ROUTES } from './lighthouse-config';

const PAGESPEED_API_BASE =
  'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

export const CWV_THRESHOLDS = { lcpMs: 2500, inpMs: 200, cls: 0.1 };

export type PagespeedStrategy = 'mobile' | 'desktop';

export type PagespeedConfig = {
  siteUrl: string;
  apiKey: string | undefined;
  strategy: PagespeedStrategy;
  routes: string[];
};

export type PagespeedResult = {
  performance: number;
  seo: number;
  lcpMs: number | undefined;
  inpMs: number | undefined;
  cls: number | undefined;
  fieldLcpMs: number | undefined;
  fieldInpMs: number | undefined;
  fieldCls: number | undefined;
};

function parseArg(argv: string[], name: string): string | undefined {
  const prefix = `--${name}=`;
  return argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

export function resolvePagespeedConfig(
  argv: string[],
  env: Record<string, string | undefined>,
): PagespeedConfig {
  const rawKey = env['GOOGLE_PAGESPEED_API_KEY'];
  const apiKey = rawKey?.trim() ? rawKey.trim() : undefined;
  const strategy =
    parseArg(argv, 'strategy') === 'desktop' ? 'desktop' : 'mobile';
  const routeFilter = parseArg(argv, 'route');
  const routes = routeFilter
    ? LIGHTHOUSE_ROUTES.filter((route) => route === routeFilter)
    : LIGHTHOUSE_ROUTES;
  if (routes.length === 0) {
    throw new Error(`No PageSpeed routes match "${routeFilter}".`);
  }
  return { siteUrl: PRODUCTION_SITE_URL, apiKey, strategy, routes };
}

export function buildPagespeedUrl(
  pageUrl: string,
  apiKey: string,
  strategy: PagespeedStrategy,
): string {
  const params = new URLSearchParams({
    url: pageUrl,
    strategy,
    key: apiKey,
  });
  params.append('category', 'performance');
  params.append('category', 'seo');
  return `${PAGESPEED_API_BASE}?${params.toString()}`;
}

function scoreOf(value: unknown): number {
  const raw =
    typeof value === 'object' && value !== null
      ? (value as { score?: unknown }).score
      : undefined;
  return typeof raw === 'number' ? Math.round(raw * 100) : 0;
}

function numericOf(value: unknown): number | undefined {
  const raw =
    typeof value === 'object' && value !== null
      ? (value as { numericValue?: unknown }).numericValue
      : undefined;
  return typeof raw === 'number' ? raw : undefined;
}

function percentileOf(value: unknown): number | undefined {
  const raw =
    typeof value === 'object' && value !== null
      ? (value as { percentile?: unknown }).percentile
      : undefined;
  return typeof raw === 'number' ? raw : undefined;
}

export function parsePagespeedResult(payload: unknown): PagespeedResult {
  const root =
    typeof payload === 'object' && payload !== null
      ? (payload as Record<string, unknown>)
      : {};
  const lab =
    typeof root['lighthouseResult'] === 'object' &&
    root['lighthouseResult'] !== null
      ? (root['lighthouseResult'] as Record<string, unknown>)
      : {};
  const categories =
    typeof lab['categories'] === 'object' && lab['categories'] !== null
      ? (lab['categories'] as Record<string, unknown>)
      : {};
  const audits =
    typeof lab['audits'] === 'object' && lab['audits'] !== null
      ? (lab['audits'] as Record<string, unknown>)
      : {};
  const field =
    typeof root['loadingExperience'] === 'object' &&
    root['loadingExperience'] !== null
      ? ((
          root['loadingExperience'] as {
            metrics?: Record<string, unknown>;
          }
        ).metrics ?? {})
      : {};
  const fieldCls = percentileOf(field['CUMULATIVE_LAYOUT_SHIFT_SCORE']);
  return {
    performance: scoreOf(categories['performance']),
    seo: scoreOf(categories['seo']),
    lcpMs: numericOf(audits['largest-contentful-paint']),
    inpMs: numericOf(audits['interaction-to-next-paint']),
    cls: numericOf(audits['cumulative-layout-shift']),
    fieldLcpMs: percentileOf(field['LARGEST_CONTENTFUL_PAINT_MS']),
    fieldInpMs: percentileOf(field['INTERACTION_TO_NEXT_PAINT']),
    fieldCls: fieldCls === undefined ? undefined : fieldCls / 100,
  };
}

export function isQuotaError(status: number, payload: unknown): boolean {
  if (status === 429) {
    return true;
  }
  if (status !== 403) {
    return false;
  }
  const message = JSON.stringify(payload ?? {});
  return (
    message.includes('rateLimitExceeded') ||
    message.includes('quotaExceeded') ||
    message.includes('RESOURCE_EXHAUSTED')
  );
}

function vitalText(
  label: string,
  value: number | undefined,
  threshold: number,
): string {
  if (value === undefined) {
    return `${label}=n/a`;
  }
  const rounded = Math.round(value * 100) / 100;
  return `${label}=${rounded}${value <= threshold ? '' : '!'}`;
}

function fieldVitalText(
  label: string,
  value: number | undefined,
  threshold: number,
): string {
  if (value === undefined) {
    return `field-${label}=n/a`;
  }
  return vitalText(`field-${label}`, value, threshold);
}

export function formatRouteSummary(
  route: string,
  result: PagespeedResult,
): string {
  const failures: string[] = [];
  if (result.performance < LIGHTHOUSE_MIN_SCORES.performance) {
    failures.push(
      `performance: ${result.performance} < ${LIGHTHOUSE_MIN_SCORES.performance}`,
    );
  }
  if (result.seo < LIGHTHOUSE_MIN_SCORES.seo) {
    failures.push(`seo: ${result.seo} < ${LIGHTHOUSE_MIN_SCORES.seo}`);
  }
  if (result.lcpMs !== undefined && result.lcpMs > CWV_THRESHOLDS.lcpMs) {
    failures.push(
      `LCP: ${Math.round(result.lcpMs)}ms > ${CWV_THRESHOLDS.lcpMs}ms`,
    );
  }
  if (result.inpMs !== undefined && result.inpMs > CWV_THRESHOLDS.inpMs) {
    failures.push(
      `INP: ${Math.round(result.inpMs)}ms > ${CWV_THRESHOLDS.inpMs}ms`,
    );
  }
  if (result.cls !== undefined && result.cls > CWV_THRESHOLDS.cls) {
    failures.push(`CLS: ${result.cls} > ${CWV_THRESHOLDS.cls}`);
  }
  const vitals = [
    vitalText('LCP', result.lcpMs, CWV_THRESHOLDS.lcpMs),
    vitalText('INP', result.inpMs, CWV_THRESHOLDS.inpMs),
    vitalText('CLS', result.cls, CWV_THRESHOLDS.cls),
    fieldVitalText('LCP', result.fieldLcpMs, CWV_THRESHOLDS.lcpMs),
    fieldVitalText('INP', result.fieldInpMs, CWV_THRESHOLDS.inpMs),
    fieldVitalText('CLS', result.fieldCls, CWV_THRESHOLDS.cls),
  ].join(' ');
  const status = failures.length === 0 ? 'PASS' : 'FAIL';
  const detail = failures.length === 0 ? '' : `: ${failures.join('; ')}`;
  return `${status} ${route}: performance=${result.performance} seo=${result.seo} ${vitals}${detail}`;
}

async function fetchRoute(
  siteUrl: string,
  route: string,
  config: PagespeedConfig,
): Promise<PagespeedResult> {
  const pageUrl = new URL(route, `${siteUrl}/`).toString();
  const apiUrl = buildPagespeedUrl(
    pageUrl,
    config.apiKey as string,
    config.strategy,
  );
  const response = await fetch(apiUrl);
  const payload = (await response.json()) as unknown;
  if (!response.ok) {
    if (isQuotaError(response.status, payload)) {
      throw new Error(
        `PageSpeed API quota exceeded (HTTP ${response.status}). ` +
          'Anonymous quota is rate-limited; set GOOGLE_PAGESPEED_API_KEY to a free key from Google Cloud Console.',
      );
    }
    throw new Error(
      `PageSpeed API request failed (HTTP ${response.status}) for ${pageUrl}.`,
    );
  }
  return parsePagespeedResult(payload);
}

async function checkRoute(
  route: string,
  config: PagespeedConfig,
): Promise<boolean> {
  console.log(`Checking PageSpeed (${config.strategy}) for ${route}...`);
  try {
    const result = await fetchRoute(config.siteUrl, route, config);
    const line = formatRouteSummary(route, result);
    console.log(line);
    return line.startsWith('FAIL');
  } catch (error) {
    console.error(
      `FAIL ${route}: ${error instanceof Error ? error.message : error}`,
    );
    return true;
  }
}

export async function runPagespeedCheck(
  argv: string[] = Bun.argv.slice(2),
  env: Record<string, string | undefined> = process.env,
): Promise<void> {
  let config: PagespeedConfig;
  try {
    config = resolvePagespeedConfig(argv, env);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 2;
    return;
  }
  if (!config.apiKey) {
    console.error(
      'Missing GOOGLE_PAGESPEED_API_KEY. Create a free key in Google Cloud Console ' +
        '(enable the PageSpeed Insights API) and export it; it is never committed.',
    );
    process.exitCode = 2;
    return;
  }
  let failed = false;
  for (const route of config.routes) {
    failed = (await checkRoute(route, config)) || failed;
  }
  process.exitCode = failed ? 1 : 0;
}

if (import.meta.main) {
  await runPagespeedCheck();
}
