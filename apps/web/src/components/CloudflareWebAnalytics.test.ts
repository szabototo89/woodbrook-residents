import { describe, expect, it } from 'vitest';

import {
  createCloudflareBeaconPayload,
  resolveCloudflareWebAnalyticsToken,
} from './CloudflareWebAnalytics';

describe('Cloudflare Web Analytics token', () => {
  it('returns the configured token', () => {
    expect(
      resolveCloudflareWebAnalyticsToken({
        VITE_CF_WEB_ANALYTICS_TOKEN: 'example-token',
      }),
    ).toBe('example-token');
  });

  it('ignores a missing or blank token so no beacon is emitted', () => {
    expect(resolveCloudflareWebAnalyticsToken({})).toBeUndefined();
    expect(
      resolveCloudflareWebAnalyticsToken({ VITE_CF_WEB_ANALYTICS_TOKEN: '  ' }),
    ).toBeUndefined();
  });

  it('encodes the token as the beacon payload', () => {
    expect(createCloudflareBeaconPayload('example-token')).toBe(
      '{"token":"example-token"}',
    );
  });
});
