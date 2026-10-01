import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test as base, type BrowserContext } from '@playwright/test';
import { isGalleryQuery, withGalleryFixture } from './gallery-data.mjs';

export { expect } from '@playwright/test';

const artworkRoot = fileURLToPath(
  new URL('../../public/artwork/', import.meta.url),
);

export async function routeGalleryFixture(context: BrowserContext) {
  await context.route('https://uag6kepo.api.sanity.io/**', async (route) => {
    if (!isGalleryQuery(route.request().url())) return route.continue();
    const headers = Object.fromEntries(
      Object.entries(route.request().headers()).filter(
        ([name]) => name !== 'origin',
      ),
    );
    const response = await route.fetch({ headers });
    await route.fulfill({
      response,
      json: withGalleryFixture(await response.json()),
    });
  });
  await context.route(
    'https://cdn.sanity.io/**/d9bb83bbbb07c39f42f8c62a2c96a096c4c0e457-*',
    (route) => {
      const width = Number(
        new URL(route.request().url()).searchParams.get('w'),
      );
      const variant =
        width <= 320
          ? '-320'
          : width <= 640
            ? '-640'
            : width <= 960
              ? '-960'
              : '';
      return route.fulfill({
        path: path.join(artworkRoot, `gallery-hero-cutout${variant}.webp`),
        contentType: 'image/webp',
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    },
  );
}

export const test = base.extend({
  context: async ({ context }, use) => {
    await routeGalleryFixture(context);
    await use(context);
  },
});
