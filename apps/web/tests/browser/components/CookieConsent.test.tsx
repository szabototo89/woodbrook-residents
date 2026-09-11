import { beforeEach, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';

import { ClarityAnalytics } from '../../../src/components/ClarityAnalytics';
import {
  COOKIE_CONSENT_STORAGE_KEY,
  CookieConsentBanner,
  clearCookieConsentChoice,
} from '../../../src/components/CookieConsent';

beforeEach(() => {
  window.localStorage.clear();
  vi.unstubAllEnvs();
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
  expect(document.body.innerHTML).toContain('test-project');
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
  expect(document.body.innerHTML).not.toContain('test-project');
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
