import { expect, spyOn, test } from 'bun:test';

import {
  CWV_THRESHOLDS,
  buildPagespeedUrl,
  formatRouteSummary,
  isQuotaError,
  parsePagespeedResult,
  resolvePagespeedConfig,
  runPagespeedCheck,
} from './check-pagespeed';

function pagespeedPayload() {
  return {
    lighthouseResult: {
      requestedUrl: 'https://woodbrook.shankill.workers.dev/events',
      finalUrl: 'https://woodbrook.shankill.workers.dev/events',
      categories: {
        performance: { score: 0.94 },
        seo: { score: 1 },
      },
      audits: {
        'largest-contentful-paint': { numericValue: 2100 },
        'interaction-to-next-paint': { numericValue: 150 },
        'cumulative-layout-shift': { numericValue: 0.05 },
      },
    },
    loadingExperience: {
      metrics: {
        LARGEST_CONTENTFUL_PAINT_MS: { percentile: 2300 },
        INTERACTION_TO_NEXT_PAINT: { percentile: 180 },
        CUMULATIVE_LAYOUT_SHIFT_SCORE: { percentile: 6 },
      },
    },
  };
}

test('config defaults to production routes and reads the API key from env', () => {
  const config = resolvePagespeedConfig([], {
    GOOGLE_PAGESPEED_API_KEY: 'test-key',
  });
  expect(config.siteUrl).toBe('https://woodbrook.shankill.workers.dev');
  expect(config.apiKey).toBe('test-key');
  expect(config.strategy).toBe('mobile');
  expect(config.routes).toEqual([
    '/',
    '/events',
    '/local-info',
    '/projects',
    '/surveys',
    '/updates',
    '/get-involved',
  ]);
});

test('config reports a missing API key instead of calling the API', () => {
  const config = resolvePagespeedConfig([], {});
  expect(config.apiKey).toBeUndefined();
});

test('config accepts a route filter and strategy', () => {
  const config = resolvePagespeedConfig(
    ['--route=/events', '--strategy=desktop'],
    { GOOGLE_PAGESPEED_API_KEY: 'test-key' },
  );
  expect(config.routes).toEqual(['/events']);
  expect(config.strategy).toBe('desktop');
});

test('config rejects an unknown route filter', () => {
  expect(() =>
    resolvePagespeedConfig(['--route=/missing'], {
      GOOGLE_PAGESPEED_API_KEY: 'test-key',
    }),
  ).toThrow('No PageSpeed routes match "/missing".');
});

test('pagespeed URL targets the v5 API with performance and seo categories', () => {
  const url = buildPagespeedUrl(
    'https://woodbrook.shankill.workers.dev/events',
    'test-key',
    'mobile',
  );
  expect(url).toContain('pagespeedonline/v5/runPagespeed');
  expect(url).toContain(
    `url=${encodeURIComponent('https://woodbrook.shankill.workers.dev/events')}`,
  );
  expect(url).toContain('strategy=mobile');
  expect(url).toContain('category=performance');
  expect(url).toContain('category=seo');
  expect(url).toContain('key=test-key');
});

test('result parser extracts lab scores and vitals', () => {
  const result = parsePagespeedResult(pagespeedPayload());
  expect(result.performance).toBe(94);
  expect(result.seo).toBe(100);
  expect(result.lcpMs).toBe(2100);
  expect(result.inpMs).toBe(150);
  expect(result.cls).toBe(0.05);
});

test('result parser extracts CrUX field percentiles', () => {
  const result = parsePagespeedResult(pagespeedPayload());
  expect(result.fieldLcpMs).toBe(2300);
  expect(result.fieldInpMs).toBe(180);
  expect(result.fieldCls).toBe(0.06);
});

test('result parser tolerates missing audits', () => {
  const result = parsePagespeedResult({ lighthouseResult: {} });
  expect(result.performance).toBe(0);
  expect(result.lcpMs).toBeUndefined();
});

test('quota errors are detected from API error payloads', () => {
  expect(isQuotaError(429, { error: { status: 'RESOURCE_EXHAUSTED' } })).toBe(
    true,
  );
  expect(
    isQuotaError(403, {
      error: { errors: [{ reason: 'rateLimitExceeded' }] },
    }),
  ).toBe(true);
  expect(isQuotaError(400, { error: { status: 'INVALID_ARGUMENT' } })).toBe(
    false,
  );
});

test('CWV thresholds match the good band', () => {
  expect(CWV_THRESHOLDS).toEqual({ lcpMs: 2500, inpMs: 200, cls: 0.1 });
});

test('summary line passes a good route and flags a slow one', () => {
  const good = parsePagespeedResult(pagespeedPayload());
  expect(formatRouteSummary('/events', good)).toContain('PASS');
  const slow = parsePagespeedResult({
    lighthouseResult: {
      categories: { performance: { score: 0.5 }, seo: { score: 1 } },
      audits: {
        'largest-contentful-paint': { numericValue: 5000 },
        'interaction-to-next-paint': { numericValue: 150 },
        'cumulative-layout-shift': { numericValue: 0.05 },
      },
    },
  });
  const line = formatRouteSummary('/events', slow);
  expect(line).toContain('FAIL');
  expect(line).toContain('performance');
});

function mockFetchResponse(payload: unknown, status: number) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
  } as Response;
}

async function runWithFetch(
  argv: string[],
  env: Record<string, string | undefined>,
  response: Response,
): Promise<{ exitCode: number | undefined; output: string[] }> {
  const output: string[] = [];
  const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(response);
  const log = console.log;
  const error = console.error;
  console.log = (...args: unknown[]) => {
    output.push(args.join(' '));
  };
  console.error = (...args: unknown[]) => {
    output.push(args.join(' '));
  };
  process.exitCode = undefined;
  try {
    await runPagespeedCheck(argv, env);
    return { exitCode: process.exitCode, output };
  } finally {
    fetchSpy.mockRestore();
    console.log = log;
    console.error = error;
    process.exitCode = undefined;
  }
}

test('check loop passes a good route with exit 0', async () => {
  const { exitCode, output } = await runWithFetch(
    ['--route=/events'],
    { GOOGLE_PAGESPEED_API_KEY: 'test-key' },
    mockFetchResponse(pagespeedPayload(), 200),
  );
  expect(exitCode).toBe(0);
  expect(output.some((line) => line.includes('PASS /events'))).toBe(true);
});

test('check loop fails a slow route with exit 1', async () => {
  const { exitCode, output } = await runWithFetch(
    ['--route=/events'],
    { GOOGLE_PAGESPEED_API_KEY: 'test-key' },
    mockFetchResponse(
      {
        lighthouseResult: {
          categories: { performance: { score: 0.5 }, seo: { score: 1 } },
          audits: {
            'largest-contentful-paint': { numericValue: 5000 },
          },
        },
      },
      200,
    ),
  );
  expect(exitCode).toBe(1);
  expect(output.some((line) => line.includes('FAIL /events'))).toBe(true);
});

test('check loop reports quota errors with exit 1', async () => {
  const { exitCode, output } = await runWithFetch(
    ['--route=/events'],
    { GOOGLE_PAGESPEED_API_KEY: 'test-key' },
    mockFetchResponse({ error: { status: 'RESOURCE_EXHAUSTED' } }, 429),
  );
  expect(exitCode).toBe(1);
  expect(output.some((line) => line.includes('quota exceeded'))).toBe(true);
});

test('check loop exits 2 without calling the API when the key is missing', async () => {
  const fetchSpy = spyOn(globalThis, 'fetch');
  const error = console.error;
  let message = '';
  console.error = (...args: unknown[]) => {
    message = args.join(' ');
  };
  process.exitCode = undefined;
  try {
    await runPagespeedCheck([], {});
    const readExitCode = (): unknown => process.exitCode;
    expect(readExitCode()).toBe(2);
    expect(message).toContain('Missing GOOGLE_PAGESPEED_API_KEY');
    expect(fetchSpy).not.toHaveBeenCalled();
  } finally {
    fetchSpy.mockRestore();
    console.error = error;
    process.exitCode = undefined;
  }
});
