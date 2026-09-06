import { expect, test } from '@playwright/test';

test('the homepage has no horizontal overflow on a phone', async ({ page }) => {
  await page.goto('/');

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /a shared place for everyday woodbrook/i,
    }),
  ).toBeVisible();
});
