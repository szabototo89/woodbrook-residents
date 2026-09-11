import { expect, test } from 'vitest';

import {
  createCloudflareBeaconPayload,
  resolveCloudflareWebAnalyticsToken,
} from './CloudflareWebAnalytics';

test('Cloudflare Web Analytics token returns the configured token', () => {
  expect(
    resolveCloudflareWebAnalyticsToken({
      VITE_CF_WEB_ANALYTICS_TOKEN: 'example-token',
    }),
  ).toBe('example-token');
});

test('Cloudflare Web Analytics token ignores a missing or blank token so no beacon is emitted', () => {
  expect(resolveCloudflareWebAnalyticsToken({})).toBeUndefined();
  expect(
    resolveCloudflareWebAnalyticsToken({ VITE_CF_WEB_ANALYTICS_TOKEN: '  ' }),
  ).toBeUndefined();
});

test('Cloudflare Web Analytics token encodes the token as the beacon payload', () => {
  expect(createCloudflareBeaconPayload('example-token')).toBe(
    '{"token":"example-token"}',
  );
});
