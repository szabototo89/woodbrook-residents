import * as files from 'node:fs/promises';
import { expect, test, vi } from 'vitest';
vi.mock('node:fs/promises', async () => {
  const actual =
    await vi.importActual<typeof import('node:fs/promises')>(
      'node:fs/promises',
    );
  return { ...actual, readFile: vi.fn(actual.readFile) };
});
import {
  generateLauraSnapshot,
  loadLauraSnapshot,
  readLauraSnapshot,
} from '../../../scripts/lauraSnapshot';

test('captures each page once for the build snapshot', async () => {
  const home = { settings: { email: 'home@example.com' } };
  const about = { settings: { email: 'about@example.com' } };
  const services = { settings: { email: 'services@example.com' } };
  const prices = { title: 'Prices' };
  const gallery = { settings: { email: 'gallery@example.com' } };
  const source = {
    loadHome: vi.fn().mockResolvedValue(home),
    loadAbout: vi.fn().mockResolvedValue(about),
    loadServices: vi.fn().mockResolvedValue(services),
    loadGallery: vi.fn().mockResolvedValue(gallery),
    loadPrices: vi.fn().mockResolvedValue(prices),
  };
  expect(await loadLauraSnapshot(source)).toEqual({
    home,
    about,
    services,
    gallery,
    prices,
  });
  for (const load of Object.values(source))
    expect(load).toHaveBeenCalledTimes(1);
});

test('fails snapshot generation if required published content cannot be loaded', async () => {
  const source = {
    loadHome: vi
      .fn()
      .mockRejectedValue(new Error('Sanity homePage is missing')),
    loadAbout: vi.fn().mockResolvedValue({}),
    loadServices: vi.fn().mockResolvedValue({}),
    loadGallery: vi.fn().mockResolvedValue({}),
    loadPrices: vi.fn().mockResolvedValue({}),
  };
  await expect(loadLauraSnapshot(source)).rejects.toThrow(
    'Sanity homePage is missing',
  );
});

test('fresh content failure never falls back to an existing generated snapshot', async () => {
  const stale = { prices: { title: 'Stale sample prices' } };
  const cachedRead = vi
    .mocked(files.readFile)
    .mockResolvedValue(JSON.stringify(stale));
  vi.stubGlobal(
    'fetch',
    vi.fn().mockRejectedValue(new Error('Fresh read unavailable')),
  );
  try {
    expect(await readLauraSnapshot()).toEqual(stale);
    cachedRead.mockClear();
    await expect(
      generateLauraSnapshot({
        projectId: 'uag6kepo',
        dataset: 'production',
        apiVersion: '2025-09-01',
      }),
    ).rejects.toThrow('Fresh read unavailable');
    expect(cachedRead).not.toHaveBeenCalled();
  } finally {
    cachedRead.mockRestore();
    vi.unstubAllGlobals();
  }
});
