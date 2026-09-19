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
        path: 'https://www.julietrosebeauty.com/sitemap.xml',
        lastSubmitted: '2026-09-17T16:06:09.349Z',
        isPending: true,
        isSitemapsIndex: false,
        warnings: '0',
        errors: '0',
      },
    ]),
  ).toEqual([
    'sitemap https://www.julietrosebeauty.com/sitemap.xml: pending, 0 errors, 0 warnings',
  ]);
});

test('sitemap check flags entries with errors', () => {
  expect(
    hasSitemapErrors([
      {
        path: 'https://www.julietrosebeauty.com/sitemap.xml',
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
        path: 'https://www.julietrosebeauty.com/sitemap.xml',
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
    formatInspectionSummary('https://www.julietrosebeauty.com/', {
      inspectionResult: {
        indexStatusResult: {
          verdict: 'NEUTRAL',
          coverageState: 'URL is unknown to Google',
        },
      },
    }),
  ).toEqual([
    'inspect https://www.julietrosebeauty.com/: URL is unknown to Google (NEUTRAL)',
  ]);
});

test('inspection check tolerates a missing index status', () => {
  expect(
    formatInspectionSummary('https://www.julietrosebeauty.com/', {}),
  ).toEqual(['inspect https://www.julietrosebeauty.com/: no status']);
});

test('check config defaults to the production property and homepage', () => {
  expect(resolveCheckConfig([], {})).toEqual({
    siteUrl: 'https://www.julietrosebeauty.com/',
    credentialsFile: undefined,
    inspectUrls: ['https://www.julietrosebeauty.com/'],
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
