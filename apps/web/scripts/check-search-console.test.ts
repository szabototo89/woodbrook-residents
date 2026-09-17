import { expect, test } from 'bun:test';

import {
  formatInspectionSummary,
  formatSitemapSummary,
  hasSitemapErrors,
  resolveCheckConfig,
} from './check-search-console';

test('sitemap check reports each submitted sitemap with errors and pending state', () => {
  expect(
    formatSitemapSummary([
      {
        path: 'https://woodbrook.shankill.workers.dev/sitemap.xml',
        lastSubmitted: '2026-09-17T16:06:09.349Z',
        isPending: true,
        isSitemapsIndex: false,
        warnings: '0',
        errors: '0',
      },
    ]),
  ).toEqual([
    'sitemap https://woodbrook.shankill.workers.dev/sitemap.xml: pending, 0 errors, 0 warnings',
  ]);
});

test('sitemap check flags entries with errors', () => {
  expect(
    hasSitemapErrors([
      {
        path: 'https://woodbrook.shankill.workers.dev/sitemap.xml',
        lastSubmitted: '2026-09-17T16:06:09.349Z',
        isPending: false,
        isSitemapsIndex: false,
        warnings: '0',
        errors: '0',
      },
    ]),
  ).toBe(false);
  expect(
    hasSitemapErrors([
      {
        path: 'https://woodbrook.shankill.workers.dev/sitemap.xml',
        lastSubmitted: '2026-09-17T16:06:09.349Z',
        isPending: false,
        isSitemapsIndex: false,
        warnings: '1',
        errors: '2',
      },
    ]),
  ).toBe(true);
});

test('inspection check reports the coverage state for a URL', () => {
  expect(
    formatInspectionSummary('https://woodbrook.shankill.workers.dev/', {
      inspectionResult: {
        indexStatusResult: {
          verdict: 'NEUTRAL',
          coverageState: 'URL is unknown to Google',
        },
      },
    }),
  ).toEqual([
    'inspect https://woodbrook.shankill.workers.dev/: URL is unknown to Google (NEUTRAL)',
  ]);
});

test('inspection check tolerates a missing index status', () => {
  expect(
    formatInspectionSummary('https://woodbrook.shankill.workers.dev/', {}),
  ).toEqual(['inspect https://woodbrook.shankill.workers.dev/: no status']);
});

test('check config defaults to the production property and homepage', () => {
  expect(resolveCheckConfig([], {})).toEqual({
    siteUrl: 'https://woodbrook.shankill.workers.dev/',
    credentialsFile: undefined,
    inspectUrls: ['https://woodbrook.shankill.workers.dev/'],
  });
});

test('check config accepts a site, credentials file, and extra URLs', () => {
  expect(
    resolveCheckConfig(
      [
        'https://example.com/',
        '--credentials-file',
        './service-account.json',
        'https://example.com/updates',
      ],
      {},
    ),
  ).toEqual({
    siteUrl: 'https://example.com/',
    credentialsFile: './service-account.json',
    inspectUrls: ['https://example.com/', 'https://example.com/updates'],
  });
});
