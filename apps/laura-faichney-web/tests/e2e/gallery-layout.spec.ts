import { expect, test } from '../fixtures/gallery-test';
import { galleryCollections } from './galleryCms';

test('collection introduction sits beside the picture on wide screens and below it on narrower screens', async ({
  page,
}) => {
  const collections = await galleryCollections();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const viewports = [320, 390, 640, 768, 900, 1023, 1024, 1280, 1440].map(
    (width) => ({ width, height: 900 }),
  );
  for (const { width, height } of [...viewports, { width: 844, height: 390 }]) {
    await page.setViewportSize({ width, height });
    for (const { slug, photos } of collections) {
      await page.goto(`/gallery/${slug}`);
      await page.evaluate(() => document.fonts.ready);
      const heading = page.getByRole('heading', { level: 1 });
      const picture = page.locator('.collection-selected-picture');
      await expect(heading).toBeVisible();
      const title = await heading.boundingBox();
      const description = await heading
        .locator('..')
        .locator('p')
        .last()
        .boundingBox();
      const back = await page
        .getByRole('link', { name: 'Back to gallery', exact: true })
        .boundingBox();
      const frame = await picture.boundingBox();
      const breadcrumb = await page
        .getByRole('navigation', { name: 'Breadcrumb' })
        .boundingBox();
      if (!title || !description || !back || !frame || !breadcrumb)
        throw new Error('Collection content is missing');
      expect(breadcrumb.y + breadcrumb.height).toBeLessThanOrEqual(
        Math.min(title.y, frame.y),
      );
      if (width >= 1024) {
        expect(title.x + title.width).toBeLessThan(frame.x);
        expect(description.x + description.width).toBeLessThan(frame.x);
        expect(back.x + back.width).toBeLessThan(frame.x);
        expect(Math.abs(title.y - frame.y)).toBeLessThan(100);
        expect(frame.width).toBeGreaterThan(title.width * 1.6);
        expect(frame.y).toBeLessThan(250);
      } else {
        expect(frame.y + frame.height).toBeLessThan(title.y);
        expect(frame.y + frame.height).toBeLessThan(description.y);
        expect(frame.y + frame.height).toBeLessThan(back.y);
        expect(frame.width).toBeGreaterThan(width * 0.8);
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
      const controls =
        photos.length > 1
          ? await page
              .getByRole('navigation', { name: 'Picture navigation' })
              .boundingBox()
          : undefined;
      if (photos.length > 1 && !controls)
        throw new Error('Picture controls are missing');
      if (controls) {
        expect(controls.x).toBeCloseTo(frame.x, 0);
        expect(controls.width).toBeCloseTo(frame.width, 0);
        expect(controls.y).toBeGreaterThanOrEqual(frame.y + frame.height);
        if (width < 1024)
          expect(controls.y + controls.height).toBeLessThan(title.y);
      }
      if ([390, 1024, 1440].includes(width) || height === 390) {
        await page.screenshot({
          path: test.info().outputPath(`${slug}-${width}.png`),
          fullPage: true,
        });
      }
    }
  }
});

test('mobile artwork position does not depend on collection description length', async ({
  page,
}) => {
  const [collection] = await galleryCollections();
  if (!collection) throw new Error('A collection is required');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`/gallery/${collection.slug}`);
  await page.evaluate(() => document.fonts.ready);
  const picture = page.locator('.collection-selected-picture');
  const before = await picture.boundingBox();
  await page
    .locator('.collection-introduction > p:not(.eyebrow)')
    .evaluate((description) => {
      description.replaceChildren(
        document.createTextNode('A longer collection description. '.repeat(40)),
      );
    });
  const after = await picture.boundingBox();
  expect(before).not.toBeNull();
  expect(after?.y).toBe(before?.y);
});

test('a single-picture collection shows its picture without a duplicate chooser', async ({
  page,
}) => {
  const collection = (await galleryCollections()).find(
    (item) => item.photos.length === 1,
  );
  if (!collection) throw new Error('A single-picture collection is required');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/gallery/${collection.slug}`);
  await expect(
    page.locator('.collection-selected-picture img[aria-hidden="false"]'),
  ).toBeVisible();
  await expect(page.getByRole('status')).toHaveCount(0);
  await expect(page.locator('.artwork-availability')).toHaveCount(0);
  await expect(
    page.getByRole('navigation', { name: 'Picture navigation' }),
  ).toHaveCount(0);
  await expect(
    page.getByRole('group', { name: 'Choose a picture' }),
  ).toHaveCount(0);
});
