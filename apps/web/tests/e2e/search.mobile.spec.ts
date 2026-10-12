import { expect, test } from '@playwright/test';
import { captureSearchDesign } from './search-design';

test('phone search keeps cards and filters usable without horizontal overflow', async ({
  page,
}) => {
  await page.goto('/search?q=DART');
  await expect(
    page.getByRole('heading', { name: 'Search results', level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: 'Quick navigation' }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: /^Services \(/ }).click();
  await expect(
    page.getByRole('link', { name: 'TFI journey planner', exact: true }),
  ).toBeVisible();
  const sizes = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(sizes.scroll).toBeLessThanOrEqual(sizes.width + 1);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(
    page
      .getByRole('navigation', { name: 'Mobile navigation' })
      .getByRole('link', { name: 'Search', exact: true }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('contentinfo').getByRole('link', { name: 'Projects' }),
  ).toBeVisible();
});

test('captures the phone design with loaded thumbnails', async ({
  page,
}, testInfo) => {
  await captureSearchDesign(page, testInfo, 430, 'mobile');
  for (const width of [320, 390, 760]) {
    await page.setViewportSize({ width, height: 900 });
    const dimensions = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client + 1);
  }
  await captureSearchDesign(page, testInfo, 430, 'mobile', '');
});
