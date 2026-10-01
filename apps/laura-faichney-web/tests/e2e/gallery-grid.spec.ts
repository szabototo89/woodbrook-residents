import { expect, test } from '../fixtures/gallery-test';

test('collection cards adapt to the available width on the home page and gallery', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const path of ['/', '/gallery']) {
    for (const [width, columns] of [
      [320, 1],
      [390, 1],
      [527, 1],
      [528, 2],
      [640, 2],
      [768, 2],
      [827, 2],
      [828, 3],
      [1024, 3],
      [1097, 3],
      [1098, 4],
      [1440, 4],
    ] as const) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const cards = page.getByRole('link', { name: /View collection:/ });
      await expect(cards.first()).toBeVisible();
      const grid = await page.locator('.gallery-collections').boundingBox();
      const first = await cards.first().boundingBox();
      const second = await cards.nth(1).boundingBox();
      if (!grid || !first || !second)
        throw new Error('Collection cards are missing');
      const gap = width <= 640 ? 8 : 30;
      expect(first.width).toBeCloseTo(
        (grid.width - gap * (columns - 1)) / columns,
        0,
      );
      expect(first.width).toBeGreaterThanOrEqual(240);
      if (columns === 1) {
        expect(second.x).toBeCloseTo(first.x, 0);
        expect(second.y).toBeGreaterThan(first.y + first.height);
      } else {
        expect(second.y).toBeCloseTo(first.y, 0);
        expect(second.x).toBeCloseTo(first.x + first.width + gap, 0);
      }
      const image = await cards.first().getByRole('img').boundingBox();
      if (!image) throw new Error('Collection cover is missing');
      expect(image.width / image.height).toBeCloseTo(4 / 3, 2);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
      if ([390, 768, 1024, 1440].includes(width)) {
        await page.locator('.gallery-collections').screenshot({
          path: test
            .info()
            .outputPath(`${path === '/' ? 'home' : 'gallery'}-${width}.png`),
        });
      }
    }
  }
});
