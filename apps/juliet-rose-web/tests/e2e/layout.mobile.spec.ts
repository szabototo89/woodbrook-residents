import { expect, test } from '@playwright/test';

test('has no horizontal overflow on a phone', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts?.ready);

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(
    dimensions.clientWidth + 1,
  );
});

test('opens and dismisses the mobile menu accessibly', async ({ page }) => {
  await page.goto('/');

  const openMenu = page.getByRole('button', { name: 'Open menu' });
  await openMenu.click();
  const closeMenu = page.getByRole('button', { name: 'Close menu' });
  await expect(closeMenu).toHaveAttribute('aria-expanded', 'true');
  await expect(
    page.getByRole('navigation', { name: 'Mobile navigation' }),
  ).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(openMenu).toHaveAttribute('aria-expanded', 'false');
});

test('keeps booking available from the mobile viewport', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('link', { name: 'Book an appointment' }).last(),
  ).toBeVisible();
});

test('keeps treatment browsing and booking controls usable on a phone', async ({
  page,
}) => {
  await page.goto('/treatments');

  await expect(
    page.getByRole('heading', { level: 1, name: 'Treatments & prices' }),
  ).toBeVisible();
  await expect(page.locator('html')).toHaveJSProperty(
    'scrollWidth',
    await page.locator('html').evaluate((element) => element.clientWidth),
  );

  await page.goto('/book?service=swedish-massage');
  await expect(page.getByRole('combobox', { name: 'Treatment' })).toHaveValue(
    'swedish-massage',
  );
  await expect(
    page.getByRole('heading', { name: 'Choose a date' }),
  ).toBeVisible();
  await expect(page.locator('html')).toHaveJSProperty(
    'scrollWidth',
    await page.locator('html').evaluate((element) => element.clientWidth),
  );
});
