import { expect, test } from '@playwright/test';

test('browser renderer loads shared runtime content and navigates', async ({
  page,
}) => {
  await page.goto('/');

  const lynxView = page.locator('lynx-view');
  await expect(lynxView).toHaveAttribute(
    'aria-label',
    'Woodbrook Residents mobile application',
  );
  await expect(page.getByText('What would you like to do?')).toBeVisible();

  await page.getByText('Projects', { exact: true }).click();
  await expect(page.getByText('Follow local change')).toBeVisible();
  await page.getByText('Green space project').click();
  await expect(page.getByText('Project details.')).toBeVisible();
});

test('production host serves the Lynx bundle from the same origin', async ({
  request,
}) => {
  const response = await request.get('/lynx/woodbrook.web.bundle');

  expect(response.ok()).toBe(true);
  expect(response.headers()['access-control-allow-origin']).toBeUndefined();
  expect((await response.body()).byteLength).toBeGreaterThan(1_000);
});
