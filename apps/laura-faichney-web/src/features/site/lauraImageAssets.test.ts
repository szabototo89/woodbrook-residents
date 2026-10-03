import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { afterEach, expect, test, vi } from 'vitest';
import {
  cacheLauraImages,
  imageCacheDirectory,
} from '../../../scripts/lauraImageAssets';
import { loadLauraSnapshot } from '../../../scripts/lauraSnapshot';
import { fixtureResponse } from '../../../tests/fixtures/site-fixtures';

const directories: string[] = [];

test('fixture builds cannot reuse or populate the production image cache', () => {
  expect(imageCacheDirectory('test')).not.toBe(
    imageCacheDirectory('production'),
  );
  expect(imageCacheDirectory('static')).toBe(imageCacheDirectory('production'));
  expect(imageCacheDirectory('development')).toBe(
    imageCacheDirectory('production'),
  );
});
afterEach(async () => {
  vi.unstubAllGlobals();
  await Promise.all(
    directories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

test('bundles responsive site assets, preserves gallery artwork and reuses downloads across builds', async () => {
  vi.stubGlobal('fetch', fixtureResponse);
  const original = await loadLauraSnapshot();
  const directory = await mkdtemp(path.join(tmpdir(), 'laura-images-'));
  directories.push(directory);
  const options = {
    cacheDirectory: path.join(directory, 'cache'),
    publicDirectory: path.join(directory, 'public'),
  };
  const imageBytes = await sharp({
    create: { width: 32, height: 32, channels: 4, background: '#d92755' },
  })
    .webp()
    .toBuffer();
  const fetch = vi.fn(
    async (url: RequestInfo | URL) =>
      new Response(new Uint8Array(imageBytes), {
        headers: {
          'Content-Type': 'image/webp',
          'X-Fixture-Source': String(url),
        },
      }),
  );
  vi.stubGlobal('fetch', fetch);
  const snapshot = await cacheLauraImages(original, options);
  expect(snapshot.home.hero.image.url).toMatch(
    /^\/site-images\/[a-f0-9]{24}\.webp$/,
  );
  expect(snapshot.home.hero.image.srcSet).toContain('320w');
  expect(snapshot.home.hero.image).toHaveProperty(
    'avifSrcSet',
    expect.stringMatching(/^\/site-images\/[a-f0-9]{24}\.avif 320w/),
  );
  const firstAvif = snapshot.home.hero.image
    .avifSrcSet!.split(', ')[0]!
    .split(' ')[0]!;
  expect(
    (
      await sharp(
        await readFile(path.join(options.publicDirectory, firstAvif)),
      ).metadata()
    ).format,
  ).toBe('heif');
  expect(snapshot.services.services[0]?.image.srcSet).toContain('640w');
  expect(snapshot.services.services[0]?.image.srcSet).toContain('768w');
  expect(snapshot.gallery.hero.image.url).toMatch(/^\/site-images\//);
  expect(snapshot.gallery.collections).toEqual(original.gallery.collections);
  expect(snapshot.home.collections).toEqual(original.home.collections);
  const bytes = await readFile(
    path.join(options.publicDirectory, snapshot.home.hero.image.url),
  );
  expect((await sharp(bytes).metadata()).format).toBe('webp');
  const calls = fetch.mock.calls.map(([url]) => String(url));
  expect(calls.length).toBeGreaterThan(0);
  expect(new Set(calls).size).toBe(calls.length);
  expect(
    calls.every(
      (url) => url.includes('fm=webp') && !url.includes('auto=format'),
    ),
  ).toBe(true);
  expect(calls.some((url) => url.includes('86bcd714'))).toBe(false);
  await rm(options.publicDirectory, { recursive: true });
  fetch.mockClear();
  expect(await cacheLauraImages(original, options)).toEqual(snapshot);
  expect(fetch).not.toHaveBeenCalled();
  expect(
    (await readdir(path.join(options.publicDirectory, 'site-images'))).filter(
      (file) => file.endsWith('.webp'),
    ).length,
  ).toBe(calls.length);
  expect(original.home.hero.image.url).toContain('cdn.sanity.io');
  const changed = structuredClone(original);
  changed.home.hero.image.url += '&rect=1,1,1000,800';
  fetch.mockClear();
  const updated = await cacheLauraImages(changed, options);
  expect(updated.home.hero.image.url).not.toBe(snapshot.home.hero.image.url);
  expect(fetch.mock.calls.length).toBe(5);
  await expect(
    readFile(path.join(options.publicDirectory, snapshot.home.hero.image.url)),
  ).rejects.toThrow();
  expect(
    (await readdir(options.cacheDirectory)).filter((file) =>
      file.endsWith('.webp'),
    ).length,
  ).toBe(calls.length + 5);
  const corrupted = path.join(
    options.cacheDirectory,
    updated.home.hero.image.url.split('/').at(-1)!,
  );
  await writeFile(corrupted, 'incomplete download');
  fetch.mockClear();
  await cacheLauraImages(changed, options);
  expect(fetch).toHaveBeenCalledTimes(1);
});

test('fails the build on an unsuccessful or invalid image download', async () => {
  vi.stubGlobal('fetch', fixtureResponse);
  const original = await loadLauraSnapshot();
  const directory = await mkdtemp(path.join(tmpdir(), 'laura-images-'));
  directories.push(directory);
  const options = {
    cacheDirectory: path.join(directory, 'cache'),
    publicDirectory: path.join(directory, 'public'),
  };
  for (const response of [
    new Response('unavailable', { status: 503 }),
    new Response('not an image'),
    new Response('broken WebP', { headers: { 'Content-Type': 'image/webp' } }),
  ]) {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
    await expect(cacheLauraImages(original, options)).rejects.toThrow(
      'Site image',
    );
  }
});

test('responsive variants respect a small source crop without upscaling it', async () => {
  vi.stubGlobal('fetch', fixtureResponse);
  const original = await loadLauraSnapshot();
  original.home.about.image.url =
    'https://cdn.sanity.io/images/uag6kepo/production/small-2000x500.jpg?rect=100,0,600,450&w=1448&h=1086&fit=crop&auto=format';
  const directory = await mkdtemp(path.join(tmpdir(), 'laura-images-'));
  directories.push(directory);
  const bytes = await sharp({
    create: { width: 8, height: 8, channels: 3, background: '#d92755' },
  })
    .webp()
    .toBuffer();
  const requests: URL[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input));
      if (url.pathname.includes('small-')) requests.push(url);
      return new Response(new Uint8Array(bytes), {
        headers: { 'Content-Type': 'image/webp' },
      });
    }),
  );
  const snapshot = await cacheLauraImages(original, {
    cacheDirectory: path.join(directory, 'cache'),
    publicDirectory: path.join(directory, 'public'),
  });
  expect(snapshot.home.about.image.srcSet).toContain('600w');
  expect(
    requests.every(
      (url) =>
        Number(url.searchParams.get('w')) <= 600 &&
        Number(url.searchParams.get('h')) <= 450,
    ),
  ).toBe(true);
  expect(
    requests.every((url) => url.searchParams.get('rect') === '100,0,600,450'),
  ).toBe(true);
});
