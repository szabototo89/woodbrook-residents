import { expect, test } from 'vitest';
import { authHref, isAuthEnabled } from './authConfig';

test('authentication is off by default and only exact true enables the environment flag', () => {
  expect(isAuthEnabled('', undefined)).toBe(false);
  expect(isAuthEnabled('', 'false')).toBe(false);
  expect(isAuthEnabled('', '1')).toBe(false);
  expect(isAuthEnabled('', 'true')).toBe(true);
});

test('authentication accepts its named query flag among other flags', () => {
  expect(isAuthEnabled('?feature_flag=firebase-auth', undefined)).toBe(true);
  expect(
    isAuthEnabled('?feature_flag=other,firebase-auth&source=test', undefined),
  ).toBe(true);
  expect(
    isAuthEnabled('?feature_flag=other&feature_flag=firebase-auth', undefined),
  ).toBe(true);
  expect(isAuthEnabled('?feature_flag=firebase-auth-extra', undefined)).toBe(
    false,
  );
  expect(isAuthEnabled('?firebase-auth=true', undefined)).toBe(false);
});

test('account links retain only feature flags and never arbitrary redirect destinations', () => {
  expect(
    authHref(
      '/register',
      '?feature_flag=firebase-auth&redirect_url=https://evil.example',
    ),
  ).toBe('/register?feature_flag=firebase-auth');
  expect(authHref('/', '')).toBe('/');
});

test('Firebase requires all public web configuration before collecting credentials', async () => {
  const { readFirebaseConfig } = await import('./authConfig');
  expect(readFirebaseConfig({})).toBeNull();
  expect(readFirebaseConfig({ VITE_FIREBASE_API_KEY: 'key' })).toBeNull();
  const env = {
    VITE_FIREBASE_API_KEY: 'sample-key',
    VITE_FIREBASE_AUTH_DOMAIN: 'woodbrook.firebaseapp.com',
    VITE_FIREBASE_PROJECT_ID: 'woodbrook',
    VITE_FIREBASE_APP_ID: '1:123:web:456',
  };
  expect(readFirebaseConfig(env)).toEqual({
    apiKey: 'sample-key',
    authDomain: 'woodbrook.firebaseapp.com',
    projectId: 'woodbrook',
    appId: '1:123:web:456',
  });
  expect(
    readFirebaseConfig({
      ...env,
      VITE_FIREBASE_AUTH_DOMAIN: 'https://bad/path',
    }),
  ).toBeNull();
});
