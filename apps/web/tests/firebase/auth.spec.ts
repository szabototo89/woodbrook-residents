import { expect, test } from '@playwright/test';
import { sampleFirebase } from './helpers/sampleFirebase';

test('resident login persists across reload and supports profile updates and sign-out', async ({
  page,
}) => {
  const requests = await sampleFirebase(page);
  await page.goto('/login?feature_flag=firebase-auth');
  await page
    .getByLabel('Email address', { exact: true })
    .fill('sample@example.com');
  await page.getByLabel('Password', { exact: true }).fill('sample-password');
  await page.getByRole('button', { name: 'Log in', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Your Woodbrook account' }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Your Woodbrook account' }),
  ).toBeVisible();
  await page.getByLabel('Display name').fill('Updated Sample');
  await page.getByRole('button', { name: 'Save name' }).click();
  await expect(page.getByRole('status')).toContainText(
    'Your name has been updated',
  );
  expect(
    requests.some(
      (request) =>
        request.path.endsWith('accounts:update') &&
        request.body.displayName === 'Updated Sample',
    ),
  ).toBe(true);
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page.getByLabel('Email address', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Email address', { exact: true })).toBeVisible();
});

test('registration sends verification and reset requests use Firebase email actions', async ({
  page,
}) => {
  const requests = await sampleFirebase(page);
  await page.goto('/register?feature_flag=firebase-auth');
  await page.getByLabel('Display name').fill('Sample Resident');
  await page
    .getByLabel('Email address', { exact: true })
    .fill('sample@example.com');
  await page.getByLabel('Password', { exact: true }).fill('sample-password');
  await page
    .getByLabel('Confirm password', { exact: true })
    .fill('sample-password');
  await page
    .getByRole('button', { name: 'Create account', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Your Woodbrook account' }),
  ).toBeVisible();
  await expect
    .poll(() =>
      requests.some((request) => request.body.requestType === 'VERIFY_EMAIL'),
    )
    .toBe(true);
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page.getByLabel('Email address', { exact: true })).toBeVisible();
  await page.goto('/forgot-password?feature_flag=firebase-auth');
  await page
    .getByLabel('Email address', { exact: true })
    .fill('sample@example.com');
  await page.getByRole('button', { name: 'Send reset link' }).click();
  await expect(page.getByRole('status')).toContainText('If an account exists');
  expect(
    requests.some((request) => request.body.requestType === 'PASSWORD_RESET'),
  ).toBe(true);
});

test('configured social buttons and small viewports stay usable', async ({
  page,
}) => {
  await sampleFirebase(page);
  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto('/login?feature_flag=firebase-auth');
  await expect(
    page.getByRole('button', { name: 'Continue with Google' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Continue with Facebook' }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
