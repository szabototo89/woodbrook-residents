import { expect, test } from '@playwright/test';

test('admin shell navigates all dashboard views', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
  await expect(
    page.getByRole('navigation', { name: 'Workspace' }),
  ).toBeVisible();

  await page.getByRole('link', { name: 'Applications' }).click();
  await expect(page).toHaveURL('/applications');
  await expect(
    page.getByRole('heading', { name: 'Applications' }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'web' })).toBeVisible();

  await page.getByRole('link', { name: 'Infrastructure' }).click();
  await expect(page).toHaveURL('/infrastructure');
  await expect(
    page.getByRole('heading', { name: 'Infrastructure' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /GitHub repository/ }),
  ).toHaveAttribute(
    'href',
    'https://github.com/szabototo89/woodbrook-residents',
  );

  await page.getByRole('link', { name: 'Build actions' }).click();
  await expect(page).toHaveURL('/actions');
  await expect(
    page.getByRole('heading', { name: 'Build actions' }),
  ).toBeVisible();
});

test('dashboard skip link receives keyboard focus', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: /skip/i }).first()).toBeFocused();
});
