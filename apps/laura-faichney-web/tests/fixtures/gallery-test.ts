import { expect, test as base, type BrowserContext } from '@playwright/test';
import { fixtureResponse } from './site-fixtures';

export { expect } from '@playwright/test';

export async function routeGalleryFixture(context: BrowserContext) {
  await context.route(
    /https:\/\/[^/]+\.(?:api|apicdn)\.sanity\.io\//,
    (route) => route.abort(),
  );
  await context.route('https://cdn.sanity.io/**', async (route) => {
    const response = await fixtureResponse(route.request().url());
    await route.fulfill({
      body: Buffer.from(await response.arrayBuffer()),
      contentType: 'image/webp',
      headers: { 'access-control-allow-origin': '*' },
    });
  });
}

export const test = base.extend({
  page: async ({ page }, use) => {
    await use(page);
    // Remove interceptions before the page closes and cancels pending requests.
    await page.context().unrouteAll({ behavior: 'ignoreErrors' });
  },
  context: async ({ context }, use) => {
    const apiRequests: string[] = [];
    context.on('request', (request) => {
      if (/\.(?:api|apicdn)\.sanity\.io\//.test(request.url()))
        apiRequests.push(request.url());
    });
    await routeGalleryFixture(context);
    await use(context);
    expect(apiRequests).toEqual([]);
  },
});
