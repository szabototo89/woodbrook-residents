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

test('home screen image assets load without failed requests', async ({
  page,
}) => {
  const failures: Array<string> = [];
  page.on('response', (response) => {
    if (response.status() >= 400) {
      failures.push(`${response.status()} ${response.url()}`);
    }
  });
  page.on('requestfailed', (request) => {
    failures.push(`failed ${request.url()}`);
  });

  await page.goto('/');
  await expect(page.getByText('What would you like to do?')).toBeVisible();
  await page.waitForTimeout(2_000);

  expect(failures).toEqual([]);
});
