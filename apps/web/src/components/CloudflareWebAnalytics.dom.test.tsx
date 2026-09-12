// @vitest-environment happy-dom
import { afterEach, expect, test, vi } from 'vitest';

import {
  CLOUDFLARE_BEACON_SRC,
  CloudflareWebAnalytics,
} from './CloudflareWebAnalytics';
import { renderUi } from '../test-utils/renderUi';

afterEach(() => {
  vi.unstubAllEnvs();
});

test('Cloudflare beacon renders the deferred beacon script with the token payload', () => {
  vi.stubEnv('VITE_CF_WEB_ANALYTICS_TOKEN', 'example-token');
  const { container, unmount } = renderUi(<CloudflareWebAnalytics />);

  const script = container.querySelector(
    `script[src="${CLOUDFLARE_BEACON_SRC}"]`,
  );
  expect(script).not.toBeNull();
  expect(script?.hasAttribute('defer')).toBe(true);
  expect(script?.getAttribute('data-cf-beacon')).toBe(
    '{"token":"example-token"}',
  );
  unmount();
  expect(document.body.innerHTML).toBe('');
});

test('Cloudflare beacon renders nothing without a token', () => {
  const { container, unmount } = renderUi(<CloudflareWebAnalytics />);

  expect(container.querySelector('script')).toBeNull();
  unmount();
});
