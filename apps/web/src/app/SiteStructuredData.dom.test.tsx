// @vitest-environment happy-dom
import { afterEach, expect, test, vi } from 'vitest';

import { renderUi } from '../test-utils/renderUi';
import { SiteStructuredData } from './SiteStructuredData';

afterEach(() => {
  vi.unstubAllEnvs();
});

test('structured data exposes the website entity for search engines', () => {
  vi.stubEnv('VITE_PUBLIC_SITE_URL', 'https://example.com');
  const { container, unmount } = renderUi(<SiteStructuredData />);

  const script = container.querySelector('script[type="application/ld+json"]');
  expect(script).not.toBeNull();
  const payload = JSON.parse(script?.textContent ?? '{}');
  expect(payload).toMatchObject({
    '@context': 'https://schema.org',
    '@graph': expect.arrayContaining([
      expect.objectContaining({
        '@type': 'WebSite',
        name: 'Woodbrook Residents',
        url: 'https://example.com/',
      }),
      expect.objectContaining({
        '@type': 'Organization',
        name: 'Woodbrook Residents',
        logo: 'https://example.com/apple-touch-icon.png',
      }),
    ]),
  });
  unmount();
});
