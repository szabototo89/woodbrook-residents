import { expect, test } from '@playwright/test';

test('account pages and navigation stay disabled without a feature flag', async ({
  page,
}) => {
  const authRequests: string[] = [];
  page.on('request', (request) => {
    if (
      /identitytoolkit\.googleapis\.com|securetoken\.googleapis\.com|clerk\./.test(
        request.url(),
      )
    )
      authRequests.push(request.url());
  });
  await page.goto('/login');
  await expect(
    page.getByRole('heading', { name: 'Accounts are not enabled' }),
  ).toBeVisible();
  await expect(
    page.getByRole('banner').getByRole('link', { name: 'Log in' }),
  ).toHaveCount(0);
  expect(authRequests).toEqual([]);
});

test('query flag enables linked account pages and survives public navigation', async ({
  page,
}) => {
  await page.goto('/login?feature_flag=firebase-auth');
  await expect(
    page.getByRole('heading', { name: 'Welcome back' }),
  ).toBeVisible();
  await page
    .getByRole('navigation', { name: 'Account options' })
    .getByRole('link', { name: 'Create an account' })
    .click();
  await expect(page).toHaveURL(/\/register\?feature_flag=firebase-auth/);
  await expect(
    page.getByRole('heading', { name: 'Create your account' }),
  ).toBeVisible();
  await page
    .getByRole('navigation', { name: 'Account options' })
    .getByRole('link', { name: 'Log in' })
    .click();
  await page.getByRole('link', { name: 'Forgot password?' }).click();
  await expect(
    page.getByRole('heading', { name: 'Reset your password' }),
  ).toBeVisible();
  await page
    .getByRole('banner')
    .getByRole('link')
    .filter({ hasText: 'Woodbrook Residents' })
    .click();
  await expect(page).toHaveURL(/feature_flag=firebase-auth/);
  await page.getByRole('banner').getByRole('link', { name: 'Log in' }).click();
  await expect(
    page.getByRole('heading', { name: 'Welcome back' }),
  ).toBeVisible();
});

test('unconfigured Firebase offers an honest setup state without collecting credentials', async ({
  page,
}) => {
  await page.goto('/register?feature_flag=firebase-auth');
  await expect(
    page.getByRole('heading', { name: 'Account access is being set up' }),
  ).toBeVisible();
  await expect(page.getByLabel('Account access').locator('input')).toHaveCount(
    0,
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex',
  );
});

test('account navigation stays reachable at a 320px phone width', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto('/login?feature_flag=firebase-auth');
  await expect(
    page.getByRole('banner').getByRole('link', { name: 'Log in' }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(
    page.getByRole('navigation', { name: 'Mobile navigation' }),
  ).toBeVisible();
});

test('repeated feature flags stay enabled through router navigation', async ({
  page,
}) => {
  await page.goto('/login?feature_flag=other&feature_flag=firebase-auth');
  await expect(
    page.getByRole('heading', { name: 'Welcome back' }),
  ).toBeVisible();
  await page
    .getByRole('banner')
    .getByRole('link')
    .filter({ hasText: 'Woodbrook Residents' })
    .click();
  await page.getByRole('banner').getByRole('link', { name: 'Log in' }).click();
  await expect(
    page.getByRole('heading', { name: 'Welcome back' }),
  ).toBeVisible();
});
