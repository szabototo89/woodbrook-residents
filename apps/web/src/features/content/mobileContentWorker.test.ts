import { expect, test, vi } from 'vitest';

import { createMobileContentWorker } from './mobileContentWorker';

const snapshot = {
  updates: [],
  projects: [],
  events: [],
  surveys: [],
  resources: [],
};

test('mobile content worker serves runtime content only on the public endpoint', async () => {
  const loadSnapshot = vi.fn().mockResolvedValue(snapshot);
  const fetchAsset = vi.fn().mockResolvedValue(new Response('asset'));
  const worker = createMobileContentWorker(loadSnapshot);

  const apiResponse = await worker.fetch(
    new Request('https://woodbrook.ie/api/mobile-content'),
    { ASSETS: { fetch: fetchAsset } },
  );
  const assetResponse = await worker.fetch(
    new Request('https://woodbrook.ie/projects/'),
    { ASSETS: { fetch: fetchAsset } },
  );

  expect(await apiResponse.json()).toEqual(snapshot);
  expect(await assetResponse.text()).toBe('asset');
  expect(loadSnapshot).toHaveBeenCalledOnce();
  expect(fetchAsset).toHaveBeenCalledOnce();
});

test('mobile content worker rejects writes to its read-only endpoint', async () => {
  const worker = createMobileContentWorker(vi.fn().mockResolvedValue(snapshot));
  const response = await worker.fetch(
    new Request('https://woodbrook.ie/api/mobile-content', { method: 'POST' }),
    { ASSETS: { fetch: vi.fn() } },
  );

  expect(response.status).toBe(405);
  expect(response.headers.get('allow')).toBe('GET');
});
