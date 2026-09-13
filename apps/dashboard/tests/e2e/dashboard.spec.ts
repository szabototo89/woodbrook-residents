import { expect, test } from '@playwright/test';

test('dashboard app selector preserves the section', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL('/app/web');
  await expect(
    page.getByRole('heading', { name: 'web', exact: true }),
  ).toBeVisible();

  await page.getByRole('link', { name: 'Scripts' }).click();
  await expect(page).toHaveURL('/app/web/scripts');
  await expect(page.getByRole('heading', { name: 'Scripts' })).toBeVisible();

  await page.getByRole('combobox', { name: 'Application' }).click();
  await page.getByRole('option', { name: 'cms' }).click();
  await expect(page).toHaveURL('/app/cms/scripts');
  await expect(page.getByText('bun run --cwd apps/cms develop')).toBeVisible();

  await page.getByRole('link', { name: 'Infrastructure' }).click();
  await expect(page).toHaveURL('/app/cms/infrastructure');
  await expect(
    page.getByRole('link', { name: /Strapi local admin/ }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Microsoft Clarity/ }),
  ).toHaveCount(0);

  await page.goto('/app/dashboard/actions');
  await expect(
    page.getByRole('heading', { name: 'Actions', exact: true }),
  ).toBeVisible();
  await expect(page.getByText('bun run build:dashboard')).toBeVisible();
});

test('dashboard skip link receives keyboard focus', async ({ page }) => {
  await page.goto('/app/web');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: /skip/i }).first()).toBeFocused();
});
