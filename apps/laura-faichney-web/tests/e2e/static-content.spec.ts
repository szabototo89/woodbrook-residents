import { expect, test } from '../fixtures/gallery-test';
import { galleryCollections } from './galleryCms';

test('direct visits and client navigation use built content without Sanity API requests', async ({
  page,
}) => {
  const requests: string[] = [];
  await page
    .context()
    .route(/https:\/\/[^/]+\.(?:api|apicdn)\.sanity\.io\//, async (route) => {
      requests.push(route.request().url());
      await route.abort();
    });
  for (const path of ['/', '/about', '/services', '/contact', '/gallery']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
  await page.clock.install();
  await page.clock.fastForward(60_000);
  for (const collection of await galleryCollections()) {
    await page
      .getByRole('link', { name: `View collection: ${collection.title}` })
      .click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      collection.title,
    );
    await page
      .getByRole('link', { name: 'Gallery', exact: true })
      .first()
      .click();
  }
  await page.getByRole('link', { name: 'About', exact: true }).first().click();
  await expect(page).toHaveURL('/about');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(requests).toEqual([]);
});
