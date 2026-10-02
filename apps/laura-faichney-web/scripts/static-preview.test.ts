import { expect, test, afterAll } from 'bun:test';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { staticResponse } from './static-preview';

const directory = await mkdtemp(path.join(tmpdir(), 'laura-static-test-'));
await mkdir(path.join(directory, 'gallery/mad-cow'), { recursive: true });
await writeFile(
  path.join(directory, 'gallery/mad-cow/index.html'),
  '<main>Mad Cow</main>',
);
await writeFile(path.join(directory, 'styles.css'), 'body { color: navy; }');
afterAll(() => rm(directory, { recursive: true }));

test('serves prerendered collection documents without an SSR backend', async () => {
  const response = await staticResponse(
    new Request('http://localhost/gallery/mad-cow'),
    directory,
  );
  expect(response.status).toBe(200);
  expect(await response.text()).toBe('<main>Mad Cow</main>');
});

test('compresses text for clients that accept gzip', async () => {
  const response = await staticResponse(
    new Request('http://localhost/styles.css', {
      headers: { 'accept-encoding': 'gzip' },
    }),
    directory,
  );
  expect(response.headers.get('content-encoding')).toBe('gzip');
  expect(response.headers.get('vary')).toBe('Accept-Encoding');
  expect(
    new TextDecoder().decode(Bun.gunzipSync(await response.arrayBuffer())),
  ).toBe('body { color: navy; }');
});

test('missing pages return 404 rather than an unrelated fallback page', async () => {
  expect(
    (
      await staticResponse(
        new Request('http://localhost/gallery/missing'),
        directory,
      )
    ).status,
  ).toBe(404);
});

test('refuses encoded paths outside the build directory', async () => {
  expect(
    (
      await staticResponse(
        new Request('http://localhost/%2e%2e%2fpackage.json'),
        directory,
      )
    ).status,
  ).toBe(404);
});
