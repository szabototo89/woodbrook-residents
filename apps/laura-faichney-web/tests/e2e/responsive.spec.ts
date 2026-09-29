import { expect, test } from '@playwright/test';

test('hero underline covers Brighter at desktop and phone sizes', async ({
  page,
}) => {
  for (const width of [390, 900, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const wordWidth = await page
      .getByRole('heading', { level: 1 })
      .evaluate((heading) => {
        const text = Array.from(heading.childNodes).find((node) =>
          node.textContent?.includes('Brighter'),
        );
        if (!text) throw new Error('Brighter is missing');
        const range = document.createRange();
        const start = text.textContent!.indexOf('Brighter');
        range.setStart(text, start);
        range.setEnd(text, start + 'Brighter'.length);
        return range.getBoundingClientRect().width;
      });
    const stroke = await page.locator('.hero-copy .gold-stroke').boundingBox();
    expect(stroke).not.toBeNull();
    expect(stroke!.width).toBeGreaterThanOrEqual(wordWidth);
    expect(stroke!.width).toBeLessThanOrEqual(wordWidth * 1.15);
  }
});

test('header branding and hero copy share the same left alignment', async ({
  page,
}) => {
  for (const width of [390, 1086, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const logo = await page
      .getByRole('banner')
      .getByRole('link', { name: 'Laura Faichney — All Things Art' })
      .boundingBox();
    const title = await page.getByRole('heading', { level: 1 }).boundingBox();
    expect(logo).not.toBeNull();
    expect(title).not.toBeNull();
    expect(Math.abs(logo!.x - title!.x)).toBeLessThanOrEqual(1);
  }
});

for (const width of [320, 390, 640, 700, 900, 1440]) {
  test(`pages remain readable and within the viewport at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });

    for (const path of ['/', '/services', '/about', '/gallery', '/contact']) {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      const documentWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
      );
      expect(
        documentWidth,
        `${path} should not scroll horizontally`,
      ).toBeLessThanOrEqual(width);

      const logo = page
        .getByRole('banner')
        .getByRole('img', { name: 'Laura Faichney — All Things Art' });
      await expect(logo).toBeVisible();
      expect(
        await logo.evaluate(
          (element: HTMLImageElement) =>
            element.complete && element.naturalWidth > 0,
        ),
      ).toBe(true);
    }
  });
}

test('phone navigation opens and closes from the keyboard', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const toggle = page.getByRole('button', { name: 'Open menu' });
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('navigation', { name: 'Primary navigation' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Close menu' }),
  ).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
  await expect(
    page.getByRole('navigation', { name: 'Primary navigation' }),
  ).toBeHidden();
});

test('phone service thumbnails and titles share a row and gallery uses two columns', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const service = page
    .getByRole('link')
    .filter({ hasText: 'Commissioned Paintings' });
  const thumbnail = await service.getByRole('img').boundingBox();
  const title = await service.getByText('Commissioned Paintings').boundingBox();
  expect(thumbnail).not.toBeNull();
  expect(title).not.toBeNull();
  if (thumbnail && title) {
    expect(title.x).toBeGreaterThanOrEqual(thumbnail.x + thumbnail.width);
    expect(title.y).toBeLessThan(thumbnail.y + thumbnail.height);
  }
  const gallery = page.getByRole('link', { name: /View gallery:/ });
  const first = await gallery.nth(0).boundingBox();
  const second = await gallery.nth(1).boundingBox();
  const third = await gallery.nth(2).boundingBox();
  if (!first || !second || !third)
    throw new Error('Gallery previews are missing');
  expect(first.y).toBe(second.y);
  expect(second.x).toBeGreaterThan(first.x);
  expect(third.y).toBeGreaterThan(first.y);
});
