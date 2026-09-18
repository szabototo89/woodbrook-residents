import { expect, test } from '@playwright/test';

test('exposes site icons that load successfully', async ({ page }) => {
  await page.goto('/');

  const icons = page.locator('link[rel="icon"]');
  await expect(icons).toHaveCount(2);
  await expect(icons.first()).toHaveAttribute('href', '/favicon.svg');
  const iconResponse = await page.request.get('/favicon.svg');
  expect(iconResponse.ok()).toBe(true);
  expect(iconResponse.headers()['content-type']).toContain('image/svg+xml');

  const pngIcon = page.locator('link[rel="icon"][type="image/png"]');
  await expect(pngIcon).toHaveAttribute('href', '/favicon-48.png');
  const pngResponse = await page.request.get('/favicon-48.png');
  expect(pngResponse.ok()).toBe(true);
  expect(pngResponse.headers()['content-type']).toContain('image/png');
});

test('names the header brand link from its visible text', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('link', { name: 'Woodbrook Residents', exact: true }),
  ).toBeVisible();
});
