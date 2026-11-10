import sharp from 'sharp';
import { expect, test } from '../fixtures/gallery-test';
import { galleryCollections } from './galleryCms';

test.use({ javaScriptEnabled: false });

test('link crawlers receive a branded image on every public page without JavaScript', async ({
  page,
  request,
}) => {
  const routes = [
    '/',
    '/about',
    '/services',
    '/contact',
    '/gallery',
    ...(await galleryCollections()).map(
      (collection) => `/gallery/${collection.slug}`,
    ),
  ];
  for (const path of routes) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    const imageUrl = await page
      .locator('meta[property="og:image"]')
      .getAttribute('content');
    expect(imageUrl).toMatch(/^https?:\/\//);
    expect(new URL(imageUrl!).pathname).toBe(
      '/social/laura-faichney-share-v1.jpg',
    );
    await expect(
      page.locator('meta[property="og:image:width"]'),
    ).toHaveAttribute('content', '1200');
    await expect(
      page.locator('meta[property="og:image:height"]'),
    ).toHaveAttribute('content', '630');
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
      'content',
      /Laura Faichney.*colourful painted portrait/,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      'content',
      imageUrl!,
    );
  }
  const image = await request.get('/social/laura-faichney-share-v1.jpg');
  expect(image.status()).toBe(200);
  expect(image.headers()['content-type']).toContain('image/jpeg');
  const body = await image.body();
  expect(body.byteLength).toBeLessThan(300_000);
  expect(await sharp(body).metadata()).toMatchObject({
    width: 1200,
    height: 630,
    format: 'jpeg',
  });
});
