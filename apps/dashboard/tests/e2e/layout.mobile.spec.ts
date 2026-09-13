import { expect, test } from '@playwright/test';

test('dashboard mobile has no horizontal overflow', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Workspace status and actions' }),
  ).toBeVisible();
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
