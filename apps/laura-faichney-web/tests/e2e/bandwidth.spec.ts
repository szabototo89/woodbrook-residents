import { expect, test } from '../fixtures/gallery-test';

test('non-gallery artwork uses local responsive images on phones', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const [pathname, selector] of [
    ['/', '.hero-art img'],
    ['/about', '.page-hero-art img'],
    ['/services', '.service-list-link img'],
    ['/gallery', '.page-hero-art img'],
  ] as const) {
    await page.goto(pathname);
    const image = page.locator(selector).first();
    await image.scrollIntoViewIfNeeded();
    const downloaded = await image.evaluate(
      async (element: HTMLImageElement) => {
        await element.decode();
        const response = await fetch(element.currentSrc);
        const bitmap = await createImageBitmap(await response.blob());
        return { url: element.currentSrc, width: bitmap.width };
      },
    );
    expect(new URL(downloaded.url).pathname).toMatch(/^\/site-images\//);
    expect(downloaded.width).toBeLessThanOrEqual(640);
    expect(await image.getAttribute('srcset')).toContain('320w');
  }
});

test('distant carousel pictures download when selected while neighbours remain ready', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/gallery/availability-examples');
  const slides = page.locator('.collection-carousel-slide img');
  expect(
    await slides.evaluateAll(
      (images) => images.filter((image) => image.hasAttribute('src')).length,
    ),
  ).toBe(3);
  const distant = page.getByRole('button', {
    name: 'View picture: Unset availability painting',
    exact: true,
  });
  await distant.click();
  const selected = page.locator(
    '.collection-selected-picture img[aria-hidden="false"]',
  );
  await expect(selected).toHaveAttribute('alt', 'Unset availability painting');
  await selected.evaluate((image: HTMLImageElement) => image.decode());
  expect(
    await slides.evaluateAll(
      (images) => images.filter((image) => image.hasAttribute('src')).length,
    ),
  ).toBe(3);
  await page
    .getByRole('button', { name: 'Previous picture', exact: true })
    .click();
  await expect(selected).toHaveAttribute('alt', 'Hidden availability painting');
  await selected.evaluate((image: HTMLImageElement) => image.decode());
});
