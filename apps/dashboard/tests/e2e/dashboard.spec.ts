import { expect, test } from '@playwright/test';

test('dashboard focuses one application at a time', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL('/app/web');
  await expect(
    page.getByRole('heading', { name: 'web', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('navigation').first()).toBeVisible();

  await page.getByRole('link', { name: 'cms' }).click();
  await expect(page).toHaveURL('/app/cms');
  await expect(
    page.getByRole('heading', { name: 'cms', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Strapi local admin/ }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Microsoft Clarity/ }),
  ).toHaveCount(0);

  await page.goto('/app/dashboard');
  await expect(
    page.getByRole('heading', { name: 'dashboard', exact: true }),
  ).toBeVisible();
  await expect(page.getByText('bun run build:dashboard')).toBeVisible();
});

test('dashboard skip link receives keyboard focus', async ({ page }) => {
  await page.goto('/app/web');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: /skip/i }).first()).toBeFocused();
});
