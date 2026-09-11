import { afterEach, expect, test, vi } from 'vitest';

import {
  COOKIE_CONSENT_STORAGE_KEY,
  clearCookieConsentChoice,
  getCookieConsentChoice,
  setCookieConsentChoice,
} from './CookieConsent';

function stubWindowWithStorage() {
  const store = new Map<string, string>();
  vi.stubGlobal('window', {
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
    },
    dispatchEvent: vi.fn(),
  });
  return store;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

test('cookie consent reports no choice outside a browser', () => {
  expect(getCookieConsentChoice()).toBeNull();
});

test('cookie consent ignores writes without crashing outside a browser', () => {
  expect(() => setCookieConsentChoice('accepted')).not.toThrow();
  expect(() => clearCookieConsentChoice()).not.toThrow();
});

test('cookie consent round-trips the stored choice', () => {
  const store = stubWindowWithStorage();
  expect(getCookieConsentChoice()).toBeNull();
  setCookieConsentChoice('accepted');
  expect(store.get(COOKIE_CONSENT_STORAGE_KEY)).toBe('accepted');
  expect(getCookieConsentChoice()).toBe('accepted');
});

test('cookie consent treats an unknown stored value as no choice', () => {
  const store = stubWindowWithStorage();
  store.set(COOKIE_CONSENT_STORAGE_KEY, 'maybe');
  expect(getCookieConsentChoice()).toBeNull();
});

test('cookie consent clears the stored choice', () => {
  stubWindowWithStorage();
  setCookieConsentChoice('declined');
  clearCookieConsentChoice();
  expect(getCookieConsentChoice()).toBeNull();
});
