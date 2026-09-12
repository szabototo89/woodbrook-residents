// @vitest-environment happy-dom
import { act } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import {
  COOKIE_CONSENT_CHANGED_EVENT,
  COOKIE_CONSENT_STORAGE_KEY,
  CookieConsentBanner,
  clearCookieConsentChoice,
} from './CookieConsent';
import { click, getButtonByName, renderUi } from '../test-utils/renderUi';

function setConsentCookie(value: string) {
  document.cookie = `${COOKIE_CONSENT_STORAGE_KEY}=${value}; Max-Age=3600; Path=/; SameSite=Lax`;
}

function expireConsentCookie() {
  document.cookie = `${COOKIE_CONSENT_STORAGE_KEY}=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/`;
}

function queryBanner(container: ParentNode) {
  return container.querySelector('[aria-label="Cookie consent"]');
}

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  expireConsentCookie();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  expireConsentCookie();
});

test('Cookie banner asks first-time visitors for analytics consent', () => {
  const { container, unmount } = renderUi(<CookieConsentBanner />);

  expect(queryBanner(container)).not.toBeNull();
  expect(getButtonByName(container, 'Accept analytics cookies')).not.toBeNull();
  expect(getButtonByName(container, 'Reject')).not.toBeNull();
  unmount();
});

test('Cookie banner hides after accepting and stores the choice', () => {
  const { container, unmount } = renderUi(<CookieConsentBanner />);

  click(getButtonByName(container, 'Accept analytics cookies'));

  expect(queryBanner(container)).toBeNull();
  expect(document.cookie).toContain(`${COOKIE_CONSENT_STORAGE_KEY}=accepted`);
  unmount();
});

test('Cookie banner hides after rejecting and stores the choice', () => {
  const { container, unmount } = renderUi(<CookieConsentBanner />);

  click(getButtonByName(container, 'Reject'));

  expect(queryBanner(container)).toBeNull();
  expect(document.cookie).toContain(`${COOKIE_CONSENT_STORAGE_KEY}=declined`);
  unmount();
});

test('Cookie banner stays hidden for a returning visitor', () => {
  setConsentCookie('accepted');
  const { container, unmount } = renderUi(<CookieConsentBanner />);

  expect(queryBanner(container)).toBeNull();
  unmount();
});

test('Cookie banner returns after the consent cookie is cleared', () => {
  setConsentCookie('accepted');
  const { container, unmount } = renderUi(<CookieConsentBanner />);
  expect(queryBanner(container)).toBeNull();

  expireConsentCookie();
  act(() => {
    window.dispatchEvent(new Event('focus'));
  });

  expect(queryBanner(container)).not.toBeNull();
  unmount();
});

test('Cookie banner returns after clearing the choice', () => {
  vi.useFakeTimers();
  try {
    setConsentCookie('declined');
    const { container, unmount } = renderUi(<CookieConsentBanner />);
    expect(queryBanner(container)).toBeNull();

    act(() => {
      clearCookieConsentChoice();
    });
    vi.advanceTimersByTime(10);

    expect(document.cookie).not.toContain(COOKIE_CONSENT_STORAGE_KEY);
    act(() => {
      window.dispatchEvent(new Event(COOKIE_CONSENT_CHANGED_EVENT));
    });

    expect(queryBanner(container)).not.toBeNull();
    unmount();
  } finally {
    vi.useRealTimers();
  }
});
