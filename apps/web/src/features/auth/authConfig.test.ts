import { expect, test } from 'vitest';
import { authHref, isAuthEnabled } from './authConfig';

test('authentication is off by default and only exact true enables the environment flag', () => {
  expect(isAuthEnabled('', undefined)).toBe(false);
  expect(isAuthEnabled('', 'false')).toBe(false);
  expect(isAuthEnabled('', '1')).toBe(false);
  expect(isAuthEnabled('', 'true')).toBe(true);
});

test('authentication accepts its named query flag among other flags', () => {
  expect(isAuthEnabled('?feature_flag=clerk-auth', undefined)).toBe(true);
  expect(
    isAuthEnabled('?feature_flag=other,clerk-auth&source=test', undefined),
  ).toBe(true);
  expect(
    isAuthEnabled('?feature_flag=other&feature_flag=clerk-auth', undefined),
  ).toBe(true);
  expect(isAuthEnabled('?feature_flag=clerk-auth-extra', undefined)).toBe(
    false,
  );
  expect(isAuthEnabled('?clerk-auth=true', undefined)).toBe(false);
});

test('account links retain only feature flags and never arbitrary redirect destinations', () => {
  expect(
    authHref(
      '/register',
      '?feature_flag=clerk-auth&redirect_url=https://evil.example',
    ),
  ).toBe('/register?feature_flag=clerk-auth');
  expect(authHref('/', '')).toBe('/');
});

test('invalid Clerk keys remain unconfigured instead of crashing the public site', async () => {
  const { isPublishableKey } = await import('./authConfig');
  expect(isPublishableKey('')).toBe(false);
  expect(isPublishableKey('sk_test_secret')).toBe(false);
  expect(isPublishableKey('pk_test_invalid')).toBe(false);
  expect(
    isPublishableKey(`pk_test_${btoa('example.clerk.accounts.dev$')}`),
  ).toBe(true);
  expect(isPublishableKey(`pk_live_${btoa('clerk.example.com$')}`)).toBe(true);
});
