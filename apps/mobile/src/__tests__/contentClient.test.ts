import { expect, test, vi } from 'vitest';

import { loadMobileContent } from '../features/content/contentClient.js';

test('content client loads the live snapshot from the configured web API', async () => {
  const response = {
    ok: true,
    json: vi.fn().mockResolvedValue({
      updates: [],
      projects: [],
      events: [],
      surveys: [],
      resources: [],
    }),
  };
  const fetchContent = vi.fn().mockResolvedValue(response);

  await expect(
    loadMobileContent(fetchContent, 'https://woodbrook.ie'),
  ).resolves.toEqual({
    updates: [],
    projects: [],
    events: [],
    surveys: [],
    resources: [],
  });
  expect(fetchContent).toHaveBeenCalledWith(
    'https://woodbrook.ie/api/mobile-content',
  );
});

test('content client reports an unavailable API response', async () => {
  const fetchContent = vi.fn().mockResolvedValue({ ok: false });

  await expect(
    loadMobileContent(fetchContent, 'https://woodbrook.ie/'),
  ).rejects.toThrow('Content is temporarily unavailable.');
});

test('content client rejects an invalid runtime payload', async () => {
  const fetchContent = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(null),
  });

  await expect(
    loadMobileContent(fetchContent, 'https://woodbrook.ie'),
  ).rejects.toThrow('Content is temporarily unavailable.');
});
