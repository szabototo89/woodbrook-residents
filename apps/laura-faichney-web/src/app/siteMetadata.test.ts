import { expect, test } from 'vitest';

import {
  createPageHead,
  PRODUCTION_SITE_URL,
  resolveSiteUrl,
  SITE_NAME,
} from './siteMetadata';

test('site metadata uses Laura production defaults', () => {
  expect(SITE_NAME).toBe('Laura Faichney All Things Art');
  expect(PRODUCTION_SITE_URL).toBe(
    'https://laura-faichney-all-things-art.pages.dev',
  );
  expect(resolveSiteUrl({})).toBe(PRODUCTION_SITE_URL);
  expect(resolveSiteUrl({ VITE_PUBLIC_SITE_URL: '  ' })).toBe(
    PRODUCTION_SITE_URL,
  );
  expect(resolveSiteUrl({ VITE_PUBLIC_SITE_URL: 'not a URL' })).toBe(
    PRODUCTION_SITE_URL,
  );
  expect(resolveSiteUrl({ VITE_PUBLIC_SITE_URL: 'ftp://example.com' })).toBe(
    PRODUCTION_SITE_URL,
  );
  expect(
    resolveSiteUrl({ VITE_PUBLIC_SITE_URL: 'https://preview.example.com/' }),
  ).toBe('https://preview.example.com');
});

test('site metadata builds a canonical homepage without inventing a social image', () => {
  const head = createPageHead({
    title: SITE_NAME,
    description: 'Colourful paintings, murals and creative services.',
    path: '/',
  });

  expect(head.links).toEqual([
    {
      rel: 'canonical',
      href: 'https://laura-faichney-all-things-art.pages.dev/',
    },
  ]);
  expect(head.meta).toContainEqual({
    title: 'Laura Faichney | All Things Art',
  });
  expect(head.meta.some((entry) => entry.property === 'og:image')).toBe(false);
});

test('site metadata qualifies secondary page titles with the site name', () => {
  const head = createPageHead({
    title: 'Services',
    description: 'Creative services for homes, businesses and events.',
    path: '/services',
  });

  expect(head.meta).toContainEqual({
    title: 'Services | Laura Faichney All Things Art',
  });
});
