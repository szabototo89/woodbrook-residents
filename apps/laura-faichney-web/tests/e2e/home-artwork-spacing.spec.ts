import { expect, test } from '../fixtures/gallery-test';

for (const width of [
  390, 640, 641, 768, 900, 901, 1024, 1280, 1440, 1920, 2048, 2560,
]) {
  test(`home text stays separate from rectangular artwork at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    // An opaque CMS photo must work as well as the original transparent artwork.
    await page
      .locator('.hero-art source')
      .evaluateAll((sources) => sources.forEach((source) => source.remove()));
    for (const selector of ['.hero-art img', '.mural-art img']) {
      await page.locator(selector).evaluate((image) => {
        image.removeAttribute('srcset');
        image.setAttribute('src', '/artwork/service-murals.webp');
      });
    }
    for (const section of ['hero', 'mural']) {
      const copy = page.locator(`.${section}-copy`);
      const art = page.locator(`.${section}-art`);
      const copyBox = await copy.boundingBox();
      const artBox = await art.boundingBox();
      if (!copyBox || !artBox) throw new Error(`Missing ${section} content`);
      if (width > 640) {
        const gap =
          section === 'hero'
            ? artBox.x - copyBox.x - copyBox.width
            : copyBox.x - artBox.x - artBox.width;
        expect(
          gap,
          `${section} artwork has a gap beside its copy`,
        ).toBeGreaterThanOrEqual(23);
      } else {
        expect(
          artBox.y - copyBox.y - copyBox.height,
          `${section} artwork follows the copy`,
        ).toBeGreaterThanOrEqual(0);
      }
      for (const text of await copy.locator('h1, h2, p, a').all()) {
        const textBox = await text.boundingBox();
        if (!textBox) continue;
        expect(textBox.x).toBeGreaterThanOrEqual(copyBox.x - 1);
        expect(textBox.x + textBox.width).toBeLessThanOrEqual(
          copyBox.x + copyBox.width + 1,
        );
      }
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await expect(page.locator('.mural-copy').getByRole('link')).toHaveAttribute(
      'href',
      '/contact',
    );
  });
}
