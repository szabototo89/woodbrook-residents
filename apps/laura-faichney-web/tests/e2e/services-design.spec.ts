import { expect, test } from '../fixtures/gallery-test';

for (const width of [935, 1440]) {
  test(`services follow the reference hierarchy and alternate artwork at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/services');
    await page.evaluate(() => document.fonts.ready);
    await expect(
      page.getByRole('heading', { name: 'Creative Services' }),
    ).toHaveCount(0);
    const rows = page.locator('.service-list-link');
    await expect(rows).toHaveCount(5);
    for (const [index, row] of (await rows.all()).entries()) {
      const artwork = await row.getByRole('img').boundingBox();
      const copy = await row.locator('.service-list-copy').boundingBox();
      if (!artwork || !copy) throw new Error('Service content is missing');
      if (index % 2 === 0)
        expect(artwork.x + artwork.width).toBeLessThan(copy.x);
      else expect(copy.x + copy.width).toBeLessThan(artwork.x);
      expect(artwork.height).toBeGreaterThanOrEqual(width * 0.145);
    }
    await expect(
      page.getByRole('heading', { name: 'How It Works' }),
    ).toBeVisible();
    await expect(page.locator('.process-steps > li')).toHaveCount(3);
    await expect(
      page.getByRole('link', { name: 'Start a Project' }),
    ).toHaveAttribute('href', /^mailto:/);
    await expect(
      page.getByRole('link', { name: 'Instagram', exact: true }),
    ).toHaveAttribute('href', 'https://www.instagram.com/');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
  });
}

test('services retain the compact proportions of the supplied reference', async ({
  page,
}) => {
  await page.setViewportSize({ width: 935, height: 1000 });
  await page.goto('/services');
  await page.evaluate(() => document.fonts.ready);
  const firstImage = await page
    .locator('.service-list-link')
    .first()
    .getByRole('img')
    .boundingBox();
  const process = await page.locator('.services-process').boundingBox();
  if (!firstImage || !process) throw new Error('Services sections are missing');
  expect(firstImage.x).toBeGreaterThanOrEqual(85);
  expect(firstImage.y).toBeLessThanOrEqual(550);
  expect(process.y).toBeLessThanOrEqual(1450);
  expect(process.height).toBeLessThanOrEqual(230);
  const heading = await page
    .getByRole('heading', { name: 'How It Works' })
    .boundingBox();
  const middleIcon = await page.locator('.process-icon').nth(1).boundingBox();
  if (!heading || !middleIcon) throw new Error('Process content is missing');
  expect(middleIcon.y).toBeGreaterThanOrEqual(heading.y + heading.height + 8);
});

test('service options wrap and enquiry links remain keyboard accessible on phones', async ({
  page,
}) => {
  for (const width of [320, 390, 640]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/services');
    const rows = page.locator('.service-list-link');
    for (const row of await rows.all()) {
      const image = await row.getByRole('img').boundingBox();
      const heading = await row
        .getByRole('heading', { level: 2 })
        .boundingBox();
      if (!image || !heading) throw new Error('Service content is missing');
      expect(heading.y).toBeGreaterThanOrEqual(image.y + image.height + 20);
      for (const option of await row.getByRole('listitem').all()) {
        const bounds = await option.boundingBox();
        if (!bounds) throw new Error('Service option is missing');
        expect(bounds.x).toBeGreaterThanOrEqual(0);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
      }
    }
    const enquiry = rows.first();
    await enquiry.focus();
    await expect(enquiry).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/contact\?service=commissioned-paintings$/);
  }
});

test('the handwritten motto is a loaded transparent image on desktop and phones', async ({
  page,
}) => {
  for (const width of [320, 390, 935, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/services');
    const motto = page.getByRole('img', {
      name: 'Art brings people together',
      exact: true,
    });
    await expect(motto).toBeVisible();
    const asset = await motto.evaluate(async (element: HTMLImageElement) => {
      await element.decode();
      const canvas = document.createElement('canvas');
      canvas.width = element.naturalWidth;
      canvas.height = element.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas is unavailable');
      context.drawImage(element, 0, 0);
      const alpha = (x: number, y: number) =>
        context.getImageData(x, y, 1, 1).data[3];
      const pixels = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      ).data;
      const ink = Array.from(
        { length: Math.floor((canvas.width * canvas.height) / 64) },
        (_, index) => index * 64 * 4,
      ).filter((index) => pixels[index + 3]! >= 128);
      const goldPixels = ink.filter(
        (index) =>
          pixels[index]! > pixels[index + 1]! &&
          pixels[index + 1]! > pixels[index + 2]!,
      ).length;
      return {
        goldFraction: goldPixels / ink.length,
        width: element.naturalWidth,
        corners: [
          alpha(0, 0),
          alpha(canvas.width - 1, 0),
          alpha(0, canvas.height - 1),
          alpha(canvas.width - 1, canvas.height - 1),
        ],
      };
    });
    expect(asset.width).toBeGreaterThanOrEqual(1000);
    expect(asset.corners).toEqual([0, 0, 0, 0]);
    expect(asset.goldFraction).toBeGreaterThan(0.95);
  }
});
