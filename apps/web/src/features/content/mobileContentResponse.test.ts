import { expect, test, vi } from 'vitest';

import { createMobileContentResponse } from './mobileContentResponse';

test('mobile content response returns the live validated snapshot without caching it', async () => {
  const snapshot = {
    siteSetting: {
      name: 'Woodbrook Residents',
      location: 'Shankill',
      tagline: 'Local information',
      introduction: 'Welcome',
    },
    updates: [],
    projects: [],
    events: [],
    surveys: [],
    resources: [],
  };
  const loadSnapshot = vi.fn().mockResolvedValue(snapshot);

  const response = await createMobileContentResponse(loadSnapshot, vi.fn());

  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toContain('application/json');
  expect(response.headers.get('cache-control')).toBe(
    'public, max-age=60, stale-while-revalidate=300',
  );
  expect(await response.json()).toEqual(snapshot);
  expect(loadSnapshot).toHaveBeenCalledOnce();
});

test('mobile content response does not expose an upstream error', async () => {
  const reportError = vi.fn();
  const upstreamError = new Error('private upstream detail');
  const response = await createMobileContentResponse(async () => {
    throw upstreamError;
  }, reportError);

  expect(response.status).toBe(503);
  expect(await response.json()).toEqual({
    error: 'Content is temporarily unavailable.',
  });
  expect(reportError).toHaveBeenCalledWith(upstreamError);
});
