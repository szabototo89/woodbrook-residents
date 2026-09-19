import { expect, test } from 'vitest';

import {
  createPageHead,
  PRODUCTION_SITE_URL,
  resolveSiteUrl,
  SITE_NAME,
} from './siteMetadata';

test('site metadata uses Juliet Rose production defaults', () => {
  expect(SITE_NAME).toBe('Juliet Rose Beauty Studio');
  expect(PRODUCTION_SITE_URL).toBe('https://www.julietrosebeauty.com');
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
    description: 'Beauty treatments in Stillorgan.',
    path: '/',
  });

  expect(head.links).toEqual([
    { rel: 'canonical', href: 'https://www.julietrosebeauty.com/' },
  ]);
  expect(head.meta).toContainEqual({
    title: 'Juliet Rose Beauty Studio | Relax and Revitalize',
  });
  expect(head.meta.some((entry) => entry.property === 'og:image')).toBe(false);
});

test('site metadata qualifies secondary page titles with the site name', () => {
  const head = createPageHead({
    title: 'Treatments',
    description: 'Treatment details.',
    path: '/treatments',
  });

  expect(head.meta).toContainEqual({
    title: 'Treatments | Juliet Rose Beauty Studio',
  });
});
