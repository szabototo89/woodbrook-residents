import { expect, test } from '@playwright/test';

test('developer dashboard lists apps, infrastructure, and actions', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Workspace status and actions' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Applications' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Infrastructure' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Build actions' }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /GitHub repository/ }),
  ).toHaveAttribute(
    'href',
    'https://github.com/szabototo89/woodbrook-residents',
  );
  await expect(
    page.getByRole('link', { name: /Cloudflare/ }).first(),
  ).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
});
