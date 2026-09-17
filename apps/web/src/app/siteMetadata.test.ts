import { afterEach, expect, test, vi } from 'vitest';

import { createPageHead, resolveSiteUrl } from './siteMetadata';

afterEach(() => {
  vi.unstubAllEnvs();
});

test('resolveSiteUrl falls back to the production origin when the env value is missing', () => {
  expect(resolveSiteUrl({})).toBe('https://woodbrook.shankill.workers.dev');
});

test('resolveSiteUrl falls back to production when the env value is blank or invalid', () => {
  expect(resolveSiteUrl({ VITE_PUBLIC_SITE_URL: '   ' })).toBe(
    'https://woodbrook.shankill.workers.dev',
  );
  expect(resolveSiteUrl({ VITE_PUBLIC_SITE_URL: 'not-a-url' })).toBe(
    'https://woodbrook.shankill.workers.dev',
  );
  expect(resolveSiteUrl({ VITE_PUBLIC_SITE_URL: 123 })).toBe(
    'https://woodbrook.shankill.workers.dev',
  );
});

test('resolveSiteUrl keeps an explicitly configured http origin including localhost', () => {
  expect(
    resolveSiteUrl({ VITE_PUBLIC_SITE_URL: 'http://localhost:3000' }),
  ).toBe('http://localhost:3000');
  expect(resolveSiteUrl({ VITE_PUBLIC_SITE_URL: 'https://example.com/' })).toBe(
    'https://example.com',
  );
});

test('createPageHead emits canonical, Open Graph site name/locale, and image alt for indexing', () => {
  vi.stubEnv('VITE_PUBLIC_SITE_URL', 'https://example.com');

  const head = createPageHead({
    title: 'Updates',
    description: 'Latest local updates.',
    path: '/updates',
  });

  const metaByKey = new Map(
    head.meta.map((entry) => [
      entry.name ?? entry.property ?? entry.title ?? 'unknown',
      entry,
    ]),
  );

  expect(head.meta[0]).toMatchObject({
    title: 'Updates | Woodbrook Residents',
  });
  expect(metaByKey.get('description')).toMatchObject({
    content: 'Latest local updates.',
  });
  expect(metaByKey.get('og:site_name')).toMatchObject({
    content: 'Woodbrook Residents',
  });
  expect(metaByKey.get('og:locale')).toMatchObject({ content: 'en_IE' });
  expect(metaByKey.get('og:url')).toMatchObject({
    content: 'https://example.com/updates',
  });
  expect(metaByKey.get('og:image:alt')).toBeDefined();
  expect(head.links).toContainEqual({
    rel: 'canonical',
    href: 'https://example.com/updates',
  });
});

test('createPageHead emits article metadata and JSON-LD script when provided', () => {
  vi.stubEnv('VITE_PUBLIC_SITE_URL', 'https://example.com');

  const head = createPageHead({
    title: 'First update',
    description: 'Summary.',
    path: '/updates/first-update',
    ogType: 'article',
    publishedTime: '2026-09-05',
    modifiedTime: '2026-09-06',
    jsonLd: { '@type': 'Article', headline: 'First update' },
  });

  const metaByKey = new Map(
    head.meta.map((entry) => [
      entry.name ?? entry.property ?? 'unknown',
      entry,
    ]),
  );

  expect(metaByKey.get('og:type')).toMatchObject({ content: 'article' });
  expect(metaByKey.get('article:published_time')).toMatchObject({
    content: '2026-09-05T00:00:00.000Z',
  });
  expect(metaByKey.get('article:modified_time')).toMatchObject({
    content: '2026-09-06T00:00:00.000Z',
  });
  expect(head.scripts).toHaveLength(1);
  expect(head.scripts[0]).toMatchObject({ type: 'application/ld+json' });
});

test('createPageHead omits article dates when invalid and scripts when absent', () => {
  vi.stubEnv('VITE_PUBLIC_SITE_URL', 'https://example.com');

  const head = createPageHead({
    title: 'First update',
    description: 'Summary.',
    path: '/updates/first-update',
    ogType: 'article',
    publishedTime: 'not-a-date',
  });

  const keys = head.meta.map((entry) => entry.name ?? entry.property ?? '');
  expect(keys).not.toContain('article:published_time');
  expect(keys).not.toContain('article:modified_time');
  expect(head.scripts).toEqual([]);
});
test('createPageHead never emits a localhost canonical when the env value is missing', () => {
  vi.stubEnv('VITE_PUBLIC_SITE_URL', '');

  const head = createPageHead({
    title: 'Woodbrook Residents',
    description: 'Local hub.',
    path: '/',
  });

  expect(head.links).toContainEqual({
    rel: 'canonical',
    href: 'https://woodbrook.shankill.workers.dev/',
  });
});
