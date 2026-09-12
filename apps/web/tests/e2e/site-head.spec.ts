import { expect, test } from '@playwright/test';

test('exposes a site icon that loads successfully', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
    'href',
    '/favicon.svg',
  );
  const iconResponse = await page.request.get('/favicon.svg');
  expect(iconResponse.ok()).toBe(true);
  expect(iconResponse.headers()['content-type']).toContain('image/svg+xml');
});

test('names the header brand link exactly as its visible text', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('link', { name: 'Woodbrook Residents', exact: true }),
  ).toBeVisible();
});
