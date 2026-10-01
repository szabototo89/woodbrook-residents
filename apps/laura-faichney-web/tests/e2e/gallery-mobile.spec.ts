import { expect, test } from '@playwright/test';

test('gallery pictures stay prominent on phones and collection covers fill tablet rows', async ({
  page,
}) => {
  for (const width of [320, 360, 390, 430, 640, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const path of [
      '/gallery',
      '/gallery/colour-and-nature',
      '/gallery/everyday-inspiration',
    ]) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const picture = page
        .locator(
          path === '/gallery'
            ? '.gallery-collections img'
            : '.collection-selected-picture img',
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
  for (const deviceScaleFactor of [1, 2]) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor,
    });
    const page = await context.newPage();
    for (const path of ['/gallery', '/gallery/everyday-inspiration']) {
      await page.goto(path);
      const hero = page.locator('.page-hero-art img');
      await expect(hero).toBeVisible();
      const artwork = await hero.evaluate(async (image: HTMLImageElement) => {
        const source = new Image();
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
    }
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
    await context.close();
  }
});

test('mobile visitors can navigate, select pictures and use the keyboard without layout jumps', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Gallery', exact: true })
    .click();
  await page
    .getByRole('link', { name: 'View collection: Everyday inspiration' })
    .click();
  const picture = page.locator('.collection-selected-picture img');
  await picture.scrollIntoViewIfNeeded();
  const before = await picture.boundingBox();
  const next = page.getByRole('button', { name: 'Next picture', exact: true });
  await next.focus();
  await page.keyboard.press('Enter');
  await expect(picture).toHaveAttribute(
    'alt',
    'An open book on a wooden table',
  );
  await expect(next).toBeFocused();
  const after = await picture.boundingBox();
  expect(after?.width).toBe(before?.width);
  expect(after?.height).toBe(before?.height);
  await page
    .getByRole('button', {
      name: 'View picture: A notebook, camera and laptop on a creative desk',
    })
    .click();
  await expect(picture).toHaveAttribute(
    'alt',
    'A notebook, camera and laptop on a creative desk',
  );
  await page
    .getByRole('navigation', { name: 'Breadcrumb' })
    .getByRole('link', { name: 'Gallery', exact: true })
    .click();
  await expect(page).toHaveURL(/\/gallery$/);
});
