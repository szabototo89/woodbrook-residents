import { expect, test } from '../fixtures/gallery-test';

for (const width of [1024, 1440, 2048]) {
  test(`services and contact align with About at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/about');
    const reference = await page.locator('.page-hero-inner').boundingBox();
    if (!reference) throw new Error('About hero is missing');

    for (const path of ['/services', '/contact']) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      for (const container of await page.locator('.container').all()) {
        const bounds = await container.boundingBox();
        if (!bounds) throw new Error(`${path} container is missing`);
        expect(bounds.x, `${path} left margin`).toBeCloseTo(reference.x, 0);
        expect(bounds.width, `${path} content width`).toBeCloseTo(
          reference.width,
          0,
        );
      }
      const heading = await page
        .getByRole('heading', { level: 1 })
        .boundingBox();
      if (!heading) throw new Error(`${path} heading is missing`);
      expect(heading.x, `${path} title alignment`).toBeCloseTo(reference.x, 0);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
    }
  });
}
