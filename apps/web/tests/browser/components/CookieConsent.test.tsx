import { beforeEach, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';

import { ClarityAnalytics } from '../../../src/components/ClarityAnalytics';
import {
  COOKIE_CONSENT_STORAGE_KEY,
  CookieConsentBanner,
  clearCookieConsentChoice,
} from '../../../src/components/CookieConsent';

declare global {
  interface Window {
    clarity?: (...args: Array<unknown>) => void;
  }
}

beforeEach(() => {
  window.localStorage.clear();
  vi.unstubAllEnvs();
  document.getElementById('woodbrook-clarity-tag')?.remove();
  Array.from(
    document.head.querySelectorAll(
      'script[src^="https://www.clarity.ms/tag/"]',
    ),
  ).map((script) => script.remove());
  delete window.clarity;
});

test('asks first-time visitors for analytics consent', async () => {
  const screen = await render(<CookieConsentBanner />);

  await expect
    .element(screen.getByRole('region', { name: 'Cookie consent' }))
    .toBeVisible();
  await expect
    .element(screen.getByRole('button', { name: 'Accept analytics cookies' }))
    .toBeVisible();
  await expect
    .element(screen.getByRole('button', { name: 'Reject' }))
    .toBeVisible();
});

test('accepting hides the banner and enables the Clarity tag', async () => {
  vi.stubEnv('VITE_CLARITY_PROJECT_ID', 'test-project');
  const screen = await render(
    <>
      <CookieConsentBanner />
      <ClarityAnalytics />
    </>,
  );

  await screen
    .getByRole('button', { name: 'Accept analytics cookies' })
    .click();
  await vi.waitFor(() => {
    expect(
      document.body.querySelector('[aria-label="Cookie consent"]'),
    ).toBeNull();
  });
  expect(window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)).toBe(
    'accepted',
  );
  await vi.waitFor(() => {
    const tag = document.head.querySelector('#woodbrook-clarity-tag');
    expect(tag).not.toBeNull();
    expect(tag?.textContent).toContain('test-project');
    expect(tag?.textContent).toContain('https://www.clarity.ms/tag/');
  });
  await vi.waitFor(() => {
    expect(typeof window.clarity).toBe('function');
  });
});

test('rejecting keeps analytics off', async () => {
  vi.stubEnv('VITE_CLARITY_PROJECT_ID', 'test-project');
  const screen = await render(
    <>
      <CookieConsentBanner />
      <ClarityAnalytics />
    </>,
  );

  await screen.getByRole('button', { name: 'Reject' }).click();
  await vi.waitFor(() => {
    expect(
      document.body.querySelector('[aria-label="Cookie consent"]'),
    ).toBeNull();
  });
  expect(window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)).toBe(
    'declined',
  );
  expect(document.head.querySelector('#woodbrook-clarity-tag')).toBeNull();
  expect(window.clarity).toBeUndefined();
});

test('a returning visitor who accepted sees no banner', async () => {
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, 'accepted');
  await render(<CookieConsentBanner />);

  await vi.waitFor(() => {
    expect(
      document.body.querySelector('[aria-label="Cookie consent"]'),
    ).toBeNull();
  });
});

test('a returning visitor who accepted loads the Clarity tag', async () => {
  vi.stubEnv('VITE_CLARITY_PROJECT_ID', 'test-project');
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, 'accepted');
  await render(<ClarityAnalytics />);

  await vi.waitFor(() => {
    const tag = document.head.querySelector('#woodbrook-clarity-tag');
    expect(tag).not.toBeNull();
    expect(tag?.textContent).toContain('test-project');
  });
  await vi.waitFor(() => {
    expect(typeof window.clarity).toBe('function');
  });
});

test('clearing the choice brings the banner back', async () => {
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, 'declined');
  const screen = await render(<CookieConsentBanner />);
  await vi.waitFor(() => {
    expect(
      document.body.querySelector('[aria-label="Cookie consent"]'),
    ).toBeNull();
  });

  clearCookieConsentChoice();
  expect(window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)).toBeNull();

  await expect
    .element(screen.getByRole('region', { name: 'Cookie consent' }))
    .toBeVisible();
});
