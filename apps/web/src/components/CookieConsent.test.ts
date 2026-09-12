import { afterEach, expect, test, vi } from 'vitest';

import {
  COOKIE_CONSENT_MAX_AGE_SECONDS,
  COOKIE_CONSENT_STORAGE_KEY,
  clearCookieConsentChoice,
  getCookieConsentChoice,
  parseCookieConsentChoice,
  serializeCookieConsentChoice,
  setCookieConsentChoice,
} from './CookieConsent';

function stubBrowser(cookieHeader: string, protocol?: string) {
  const jar = new Map<string, string>();
  for (const part of cookieHeader.split(';')) {
    const trimmed = part.trim();
    const separator = trimmed.indexOf('=');
    if (separator > 0) {
      jar.set(trimmed.slice(0, separator), trimmed.slice(separator + 1));
    }
  }
  const written: Array<string> = [];
  vi.stubGlobal(
    'window',
    protocol === undefined
      ? { dispatchEvent: vi.fn() }
      : { location: { protocol }, dispatchEvent: vi.fn() },
  );
  vi.stubGlobal('document', {
    get cookie() {
      return Array.from(jar.entries())
        .map(([name, value]) => `${name}=${value}`)
        .join('; ');
    },
    set cookie(header: string) {
      written.push(header);
      const attributes = header.split(';').map((chunk) => chunk.trim());
      const pair = attributes[0] ?? '';
      const separator = pair.indexOf('=');
      const expired = attributes.some(
        (attribute) => attribute.toLowerCase() === 'max-age=0',
      );
      if (expired) {
        jar.delete(pair.slice(0, separator));
        return;
      }
      jar.set(pair.slice(0, separator), pair.slice(separator + 1));
    },
  });
  return written;
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

test('cookie consent parses the stored choice from a cookie header', () => {
  expect(
    parseCookieConsentChoice(`${COOKIE_CONSENT_STORAGE_KEY}=accepted`),
  ).toBe('accepted');
  expect(
    parseCookieConsentChoice(`${COOKIE_CONSENT_STORAGE_KEY}=declined`),
  ).toBe('declined');
  expect(
    parseCookieConsentChoice(
      `other=1; ${COOKIE_CONSENT_STORAGE_KEY}=accepted; theme=dark`,
    ),
  ).toBe('accepted');
});

test('cookie consent treats a missing or unknown cookie value as no choice', () => {
  expect(parseCookieConsentChoice('')).toBeNull();
  expect(parseCookieConsentChoice(undefined)).toBeNull();
  expect(parseCookieConsentChoice('other=value')).toBeNull();
  expect(parseCookieConsentChoice(`${COOKIE_CONSENT_STORAGE_KEY}=maybe`)).toBe(
    null,
  );
});

test('cookie consent serializes the choice as a long-lived first-party cookie', () => {
  const serialized = serializeCookieConsentChoice('accepted', {
    maxAgeSeconds: COOKIE_CONSENT_MAX_AGE_SECONDS,
    secure: false,
  });
  expect(serialized).toContain(`${COOKIE_CONSENT_STORAGE_KEY}=accepted`);
  expect(serialized).toContain(`Max-Age=${COOKIE_CONSENT_MAX_AGE_SECONDS}`);
  expect(serialized).toContain('Path=/');
  expect(serialized).toContain('SameSite=Lax');
  expect(serialized).not.toContain('Secure');
});

test('cookie consent marks the cookie secure only on https', () => {
  expect(
    serializeCookieConsentChoice('declined', {
      maxAgeSeconds: COOKIE_CONSENT_MAX_AGE_SECONDS,
      secure: true,
    }),
  ).toContain('Secure');
});

test('cookie consent round-trips the choice through document.cookie', () => {
  const written = stubBrowser('', 'http:');
  expect(getCookieConsentChoice()).toBeNull();
  setCookieConsentChoice('accepted');
  expect(getCookieConsentChoice()).toBe('accepted');
  expect(written[0]).toContain(`${COOKIE_CONSENT_STORAGE_KEY}=accepted`);
  expect(written[0]).not.toContain('Secure');
});

test('cookie consent marks the stored cookie secure on https pages', () => {
  const written = stubBrowser('', 'https:');
  setCookieConsentChoice('declined');
  expect(getCookieConsentChoice()).toBe('declined');
  expect(written[0]).toContain('Secure');
});

test('cookie consent reads the stored cookie without a page location', () => {
  stubBrowser(`${COOKIE_CONSENT_STORAGE_KEY}=accepted`);
  expect(getCookieConsentChoice()).toBe('accepted');
});

test('cookie consent treats an unknown cookie value as no choice', () => {
  stubBrowser(`${COOKIE_CONSENT_STORAGE_KEY}=maybe`, 'http:');
  expect(getCookieConsentChoice()).toBeNull();
});

test('cookie consent clears the stored cookie', () => {
  stubBrowser(`${COOKIE_CONSENT_STORAGE_KEY}=declined`, 'http:');
  clearCookieConsentChoice();
  expect(getCookieConsentChoice()).toBeNull();
});
