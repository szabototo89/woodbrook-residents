// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import {
  CLARITY_SCRIPT_ID,
  CLARITY_TAG_URL,
  ClarityAnalytics,
} from './ClarityAnalytics';
import { COOKIE_CONSENT_STORAGE_KEY } from './CookieConsent';
import { renderUi } from '../test-utils/renderUi';

declare global {
  interface Window {
    clarity?: (...args: Array<unknown>) => void;
  }
}

function setConsentCookie(value: string) {
  document.cookie = `${COOKIE_CONSENT_STORAGE_KEY}=${value}; Max-Age=3600; Path=/; SameSite=Lax`;
}

function expireConsentCookie() {
  document.cookie = `${COOKIE_CONSENT_STORAGE_KEY}=deleted; Max-Age=0; Path=/; SameSite=Lax`;
}

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  document.head.appendChild(document.createElement('script'));
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  expireConsentCookie();
  document.getElementById(CLARITY_SCRIPT_ID)?.remove();
  Array.from(
    document.head.querySelectorAll(`script[src^="${CLARITY_TAG_URL}"]`),
  ).map((script) => script.remove());
  delete window.clarity;
});

test('Clarity injects an executable tag after consent', () => {
  vi.stubEnv('VITE_CLARITY_PROJECT_ID', 'test-project');
  setConsentCookie('accepted');
  const { unmount } = renderUi(<ClarityAnalytics />);

  const tag = document.head.querySelector(`#${CLARITY_SCRIPT_ID}`);
  expect(tag).not.toBeNull();
  expect(tag?.textContent).toContain(CLARITY_TAG_URL);
  expect(tag?.textContent).toContain('test-project');
  unmount();
});

test('Clarity injects the tag only once', () => {
  vi.stubEnv('VITE_CLARITY_PROJECT_ID', 'test-project');
  setConsentCookie('accepted');
  const first = renderUi(<ClarityAnalytics />);
  const second = renderUi(<ClarityAnalytics />);

  expect(document.head.querySelectorAll(`#${CLARITY_SCRIPT_ID}`)).toHaveLength(
    1,
  );
  first.unmount();
  second.unmount();
});

test('Clarity stays off without consent', () => {
  vi.stubEnv('VITE_CLARITY_PROJECT_ID', 'test-project');
  setConsentCookie('declined');
  const { unmount } = renderUi(<ClarityAnalytics />);

  expect(document.head.querySelector(`#${CLARITY_SCRIPT_ID}`)).toBeNull();
  expect(window.clarity).toBeUndefined();
  unmount();
});

test('Clarity stays off without a project ID', () => {
  setConsentCookie('accepted');
  const { unmount } = renderUi(<ClarityAnalytics />);

  expect(document.head.querySelector(`#${CLARITY_SCRIPT_ID}`)).toBeNull();
  expect(window.clarity).toBeUndefined();
  unmount();
});
