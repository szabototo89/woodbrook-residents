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

function expireConsentCookie() {
  document.cookie = `${COOKIE_CONSENT_STORAGE_KEY}=deleted; Max-Age=0; Path=/; SameSite=Lax`;
}

beforeEach(() => {
  expireConsentCookie();
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
  expect(document.cookie).toContain(`${COOKIE_CONSENT_STORAGE_KEY}=accepted`);
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
  expect(document.cookie).toContain(`${COOKIE_CONSENT_STORAGE_KEY}=declined`);
  expect(document.head.querySelector('#woodbrook-clarity-tag')).toBeNull();
  expect(window.clarity).toBeUndefined();
});

test('a returning visitor who accepted sees no banner', async () => {
  document.cookie = `${COOKIE_CONSENT_STORAGE_KEY}=accepted; Max-Age=3600; Path=/; SameSite=Lax`;
  await render(<CookieConsentBanner />);

  await vi.waitFor(() => {
    expect(
      document.body.querySelector('[aria-label="Cookie consent"]'),
    ).toBeNull();
  });
});

test('a returning visitor who accepted loads the Clarity tag', async () => {
  vi.stubEnv('VITE_CLARITY_PROJECT_ID', 'test-project');
  document.cookie = `${COOKIE_CONSENT_STORAGE_KEY}=accepted; Max-Age=3600; Path=/; SameSite=Lax`;
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

test('clearing cookies shows the banner again', async () => {
  document.cookie = `${COOKIE_CONSENT_STORAGE_KEY}=accepted; Max-Age=3600; Path=/; SameSite=Lax`;
  const screen = await render(<CookieConsentBanner />);
  await vi.waitFor(() => {
    expect(
      document.body.querySelector('[aria-label="Cookie consent"]'),
    ).toBeNull();
  });

  expireConsentCookie();
  window.dispatchEvent(new Event('focus'));

  await expect
    .element(screen.getByRole('region', { name: 'Cookie consent' }))
    .toBeVisible();
});

test('clearing the choice brings the banner back', async () => {
  document.cookie = `${COOKIE_CONSENT_STORAGE_KEY}=declined; Max-Age=3600; Path=/; SameSite=Lax`;
  const screen = await render(<CookieConsentBanner />);
  await vi.waitFor(() => {
    expect(
      document.body.querySelector('[aria-label="Cookie consent"]'),
    ).toBeNull();
  });

  clearCookieConsentChoice();
  expect(document.cookie).not.toContain(COOKIE_CONSENT_STORAGE_KEY);

  await expect
    .element(screen.getByRole('region', { name: 'Cookie consent' }))
    .toBeVisible();
});
