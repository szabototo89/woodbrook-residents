import { createOfflinePage, expect, test } from '../fixtures/gallery-test';

for (const width of [320, 390, 640, 700, 900, 1440]) {
  test(`homepage announcement fits the artwork-led layout at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    const announcement = page.getByRole('region', {
      name: 'A little news from the studio',
    });
    await expect(announcement.getByRole('heading', { level: 2 })).toBeVisible();
    await expect(announcement).toContainText(
      'This sample announcement shows where Laura can share her latest update.',
    );
    const action = announcement.getByRole('link', { name: 'Meet Laura' });
    await expect(action).toHaveAttribute('href', '/about');
    const [hero, section, services, button] = await Promise.all([
      page.locator('.home-hero').boundingBox(),
      announcement.boundingBox(),
      page.locator('.services-preview').boundingBox(),
      action.boundingBox(),
    ]);
    if (!hero || !section || !services || !button)
      throw new Error('Home content is missing');
    const header = await page.getByRole('banner').boundingBox();
    if (!header) throw new Error('Site header is missing');
    expect(section.y).toBeGreaterThanOrEqual(header.y + header.height);
    expect(section.y + section.height).toBeLessThanOrEqual(hero.y);
    expect(hero.y + hero.height).toBeLessThanOrEqual(services.y);
    const card = await announcement.locator('.announcement-card').boundingBox();
    if (!card) throw new Error('Announcement card is missing');
    if (width === 1440) expect(card.height).toBeLessThanOrEqual(132);
    if (width === 390) expect(card.height).toBeLessThanOrEqual(250);
    expect(
      await announcement
        .locator('.announcement-message')
        .evaluate((element) => parseFloat(getComputedStyle(element).fontSize)),
    ).toBeGreaterThanOrEqual(16);
    expect(button.height).toBeGreaterThanOrEqual(44);
    expect(button.x).toBeGreaterThanOrEqual(0);
    expect(button.x + button.width).toBeLessThanOrEqual(width);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    for (const copy of await announcement
      .locator('h2, .announcement-message')
      .all()) {
      expect(
        await copy.evaluate((element) => {
          const card = element.closest('.announcement-card');
          if (!card) throw new Error('Announcement card is missing');
          const range = document.createRange();
          range.selectNodeContents(element);
          const text = range.getBoundingClientRect();
          const bounds = card.getBoundingClientRect();
          return (
            text.left >= bounds.left &&
            text.right <= bounds.right &&
            text.top >= bounds.top &&
            text.bottom <= bounds.bottom
          );
        }),
      ).toBe(true);
    }
    await action.focus();
    await expect(action).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/about$/);
  });
}

test('announcement copy and action are available without JavaScript', async ({
  browser,
}) => {
  const { context, page } = await createOfflinePage(browser, {
    javaScriptEnabled: false,
  });
  await page.goto('/');
  const announcement = page.getByRole('region', {
    name: 'A little news from the studio',
  });
  await expect(announcement).toBeVisible();
  await announcement.getByRole('link', { name: 'Meet Laura' }).click();
  await expect(page).toHaveURL(/\/about$/);
  await context.close();
});

test('announcement eyebrow has readable contrast across the card background', async ({
  page,
}) => {
  await page.goto('/');
  const contrast = await page.locator('.announcement-card').evaluate((card) => {
    const eyebrow = card.querySelector('.eyebrow');
    if (!eyebrow) throw new Error('Announcement eyebrow is missing');
    const luminance = (color: string) => {
      const channels = (color.match(/[\d.]+/g) ?? [])
        .slice(0, 3)
        .map(Number)
        .map((value) => {
          const channel = value / 255;
          return channel <= 0.04045
            ? channel / 12.92
            : ((channel + 0.055) / 1.055) ** 2.4;
        });
      return (
        channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722
      );
    };
    const foreground = luminance(getComputedStyle(eyebrow).color);
    const backgrounds =
      getComputedStyle(card).backgroundImage.match(/rgb\([^)]+\)/g);
    if (!backgrounds)
      throw new Error('Announcement background colours are missing');
    return Math.min(
      ...backgrounds.map(
        (color) => (luminance(color) + 0.05) / (foreground + 0.05),
      ),
    );
  });
  expect(contrast).toBeGreaterThanOrEqual(4.5);
});
