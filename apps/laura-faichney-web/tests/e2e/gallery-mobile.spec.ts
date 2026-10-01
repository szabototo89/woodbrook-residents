import { expect, test, routeGalleryFixture } from '../fixtures/gallery-test';
import { browsableCollections, galleryCollections } from './galleryCms';

test('the mobile picture viewer stays stable when browsing portrait and landscape uploads', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const [collection] = await browsableCollections();
  if (!collection) throw new Error('Browsable collection is missing');
  await page.goto(`/gallery/${collection.slug}`);
  const picture = page.locator(
    '.collection-selected-picture img[aria-hidden="false"]',
  );
  const source = await picture.getAttribute('src');
  if (!source) throw new Error('The selected picture is missing');
  await page.route(`${source.split('?')[0]}*`, (route) =>
    route.fulfill({
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="400"><rect width="200" height="400" fill="#d91e56"/><rect x="10" y="10" width="180" height="380" fill="#0d2942"/></svg>',
    }),
  );
  await page.reload();
  await picture.evaluate((image: HTMLImageElement) => image.decode());
  expect(
    await picture.evaluate(
      (image: HTMLImageElement) => image.naturalWidth / image.naturalHeight,
    ),
  ).toBeCloseTo(0.5);
  const frame = page.locator('.collection-selected-picture');
  const before = await frame.boundingBox();
  await frame.screenshot({
    path: test.info().outputPath('portrait-picture.png'),
  });
  const previousAlt = await picture.getAttribute('alt');
  await page.getByRole('button', { name: 'Next picture', exact: true }).click();
  await expect(picture).not.toHaveAttribute('alt', previousAlt!);
  await picture.evaluate((image: HTMLImageElement) => image.decode());
  const after = await frame.boundingBox();
  expect(after?.width).toBe(before?.width);
  expect(after?.height).toBe(before?.height);
});

test('gallery pictures stay prominent on phones and collection covers fill tablet rows', async ({
  page,
}) => {
  const collections = await galleryCollections();
  for (const width of [320, 360, 390, 430, 640, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const path of [
      '/gallery',
      ...collections.map((collection) => `/gallery/${collection.slug}`),
    ]) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const picture = page
        .locator(
          path === '/gallery'
            ? '.gallery-collections img'
            : '.collection-selected-picture img[aria-hidden="false"]',
        )
        .first();
      const bounds = await picture.boundingBox();
      if (!bounds) throw new Error('Gallery picture is missing');
      if (width <= 640) expect(bounds.y).toBeLessThan(650);
      if (path === '/gallery') {
        const container = await page
          .locator('.gallery-collections')
          .boundingBox();
        if (!container) throw new Error('Collections are missing');
        expect(bounds.width).toBeGreaterThan(container.width * 0.45);
      }
    }
  }
});

test('phones download smaller transparent hero assets and appropriately sized thumbnails', async ({
  browser,
}) => {
  const [collection] = await browsableCollections();
  if (!collection) throw new Error('Browsable collection is missing');
  for (const deviceScaleFactor of [1, 2]) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor,
    });
    await routeGalleryFixture(context);
    const page = await context.newPage();
    await page.goto('/gallery');
    const hero = page.locator('.page-hero-art img');
    await expect(hero).toBeVisible();
    const artwork = await hero.evaluate(async (image: HTMLImageElement) => {
      const source = new Image();
      source.crossOrigin = 'anonymous';
      source.src = image.currentSrc;
      await source.decode();
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const context = canvas.getContext('2d')!;
      context.drawImage(source, 0, 0);
      return {
        width: source.naturalWidth,
        alpha: context.getImageData(0, 0, 1, 1).data[3],
        source: image.currentSrc,
      };
    });
    expect(artwork.source).not.toMatch(/hero-cutout\.webp$/);
    expect(artwork.width).toBeLessThanOrEqual(640);
    expect(artwork.alpha).toBe(0);
    await page.goto(`/gallery/${collection.slug}`);
    await expect(
      page.locator('main img[src*="gallery-detail-hero-cutout"]'),
    ).toHaveCount(0);
    const thumbnail = page.locator('.collection-thumbnails img').last();
    await thumbnail.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        thumbnail.evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
        ),
      )
      .toBe(true);
    expect(
      await thumbnail.evaluate(async (image: HTMLImageElement) => {
        const source = new Image();
        source.src = image.currentSrc;
        await source.decode();
        return source.naturalWidth;
      }),
    ).toBeLessThanOrEqual(320);
    await context.unrouteAll({ behavior: 'ignoreErrors' });
    await context.close();
  }
});

test('mobile visitors can navigate, select pictures and use the keyboard without layout jumps', async ({
  page,
}) => {
  const [collection] = await browsableCollections();
  if (!collection) throw new Error('Browsable collection is missing');
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Gallery', exact: true })
    .click();
  await page
    .getByRole('link', { name: `View collection: ${collection.title}` })
    .click();
  const picture = page.locator(
    '.collection-selected-picture img[aria-hidden="false"]',
  );
  await picture.scrollIntoViewIfNeeded();
  const before = await picture.boundingBox();
  const next = page.getByRole('button', { name: 'Next picture', exact: true });
  await next.focus();
  await page.keyboard.press('Enter');
  await expect(picture).toHaveAttribute('alt', collection.photos[1]!);
  await expect(next).toBeFocused();
  const after = await picture.boundingBox();
  expect(after?.width).toBe(before?.width);
  expect(after?.height).toBe(before?.height);
  await page
    .getByRole('button', {
      name: `View picture: ${collection.photos[collection.photos.length - 1]}`,
    })
    .click();
  await expect(picture).toHaveAttribute(
    'alt',
    collection.photos[collection.photos.length - 1]!,
  );
  await page
    .getByRole('navigation', { name: 'Breadcrumb' })
    .getByRole('link', { name: 'Gallery', exact: true })
    .click();
  await expect(page).toHaveURL(/\/gallery$/);
});
