import { expect, test, vi } from 'vitest';

import {
  createPageHead,
  PRODUCTION_SITE_URL,
  resolveSiteUrl,
  SITE_NAME,
} from './siteMetadata';

test('site metadata uses Laura production defaults', () => {
  expect(SITE_NAME).toBe('Laura Faichney All Things Art');
  expect(PRODUCTION_SITE_URL).toBe('https://allthingsart.ie');
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

test('site metadata includes a branded large-image sharing card', () => {
  vi.stubEnv('VITE_PUBLIC_SITE_URL', '');
  try {
    const head = createPageHead({
      title: SITE_NAME,
      description: 'Colourful paintings, murals and creative services.',
      path: '/',
    });

    expect(head.links).toEqual([
      {
        rel: 'canonical',
        href: 'https://allthingsart.ie/',
      },
    ]);
    expect(head.meta).toContainEqual({
      title: 'Laura Faichney | All Things Art',
    });
    expect(head.meta).toEqual(
      expect.arrayContaining([
        {
          property: 'og:image',
          content: 'https://allthingsart.ie/social/laura-faichney-share-v1.jpg',
        },
        { property: 'og:image:type', content: 'image/jpeg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        {
          property: 'og:image:alt',
          content:
            'Laura Faichney All Things Art — Bold Art, Brighter Spaces, with a colourful painted portrait.',
        },
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'twitter:image',
          content: 'https://allthingsart.ie/social/laura-faichney-share-v1.jpg',
        },
        {
          name: 'twitter:image:alt',
          content:
            'Laura Faichney All Things Art — Bold Art, Brighter Spaces, with a colourful painted portrait.',
        },
      ]),
    );
  } finally {
    vi.unstubAllEnvs();
  }
});

test('sharing images use the configured origin for previews and nested pages', () => {
  vi.stubEnv('VITE_PUBLIC_SITE_URL', 'https://preview.example.com/');
  try {
    const head = createPageHead({
      title: 'Hummingbird',
      description: 'A colourful painting.',
      path: '/gallery/hummingbird',
    });
    expect(head.meta).toContainEqual({
      property: 'og:image',
      content: 'https://preview.example.com/social/laura-faichney-share-v1.jpg',
    });
    expect(head.links).toEqual([
      {
        rel: 'canonical',
        href: 'https://preview.example.com/gallery/hummingbird',
      },
    ]);
  } finally {
    vi.unstubAllEnvs();
  }
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
