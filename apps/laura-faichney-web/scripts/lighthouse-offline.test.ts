import { expect, test } from 'bun:test';
import { assertOfflineAuditReport } from './lighthouse-offline';

test('offline audit reports permit local images and unrelated external links', () => {
  expect(() =>
    assertOfflineAuditReport({
      audits: {
        'network-requests': {
          details: {
            items: [
              { url: 'http://127.0.0.1:4176/site-images/painting.webp' },
              { url: 'https://example.com/?link=https://cdn.sanity.io/' },
            ],
          },
        },
      },
    }),
  ).not.toThrow();
});

for (const url of [
  'https://cdn.sanity.io/images/project/production/painting.webp',
  'https://project.api.sanity.io/v2025-09-01/data/query/production',
]) {
  test(`offline audit reports fail even if a Sanity request was blocked: ${url}`, () => {
    expect(() =>
      assertOfflineAuditReport({
        audits: { 'network-requests': { details: { items: [{ url }] } } },
      }),
    ).toThrow('Sanity request');
  });
}

test('offline audits require network evidence in the report', () => {
  expect(() => assertOfflineAuditReport({})).toThrow('network requests');
});

test('standard browser checks block service workers so they cannot bypass image interception', async () => {
  const { default: config } = await import('../playwright.config');
  expect(config.use?.serviceWorkers).toBe('block');
});
