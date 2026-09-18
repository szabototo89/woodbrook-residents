import { expect, test } from 'vitest';

import type { ContentSnapshot } from '../features/content/contentTypes';
import {
  buildRobotsTxt,
  buildSitemapXml,
  collectSeoPaths,
  createOrganizationJsonLd,
  createSiteJsonLdGraph,
  createWebsiteJsonLd,
  resolveSeoSiteUrl,
} from './seoFiles';

const snapshot: ContentSnapshot = {
  updates: [
    {
      documentId: 'u1',
      title: 'Update',
      slug: 'first-update',
      kind: 'community',
      summary: 'Summary',
      body: 'Body',
      publishedOn: '2026-09-05',
      sourceName: 'Source',
      sourceUrl: 'https://example.com/source',
      sourceReviewedOn: '2026-09-05',
      featured: false,
    },
  ],
  projects: [
    {
      documentId: 'p1',
      title: 'Project',
      slug: 'first-project',
      category: 'housing',
      stage: 'active',
      summary: 'Summary',
      details: 'Details',
      updatedOn: '2026-09-06',
      sourceName: 'Source',
      sourceUrl: 'https://example.com/source',
      sourceReviewedOn: '2026-09-06',
      featured: false,
    },
  ],
  events: [
    {
      documentId: 'e1',
      title: 'Event',
      slug: 'first-event',
      summary: 'Summary',
      startsAt: '2026-09-12T17:00:00.000Z',
      location: 'Park',
      sourceUrl: 'https://example.com/source',
      sourceReviewedOn: '2026-09-09',
      featured: false,
    },
  ],
  surveys: [
    {
      documentId: 's1',
      title: 'Survey',
      slug: 'first-survey',
      stage: 'closed',
      summary: 'Summary',
      sourceName: 'Source',
      sourceUrl: 'https://example.com/source',
      sourceReviewedOn: '2026-09-05',
    },
  ],
  resources: [
    {
      documentId: 'r1',
      title: 'Resource',
      slug: 'first-resource',
      category: 'community',
      serviceType: 'Service',
      providerType: 'public-service',
      description: 'Description',
      outOfHours: false,
      featured: false,
      details: [],
      collectionDates: [],
      displayOrder: 1,
      sourceName: 'Source',
      sourceUrl: 'https://example.com/source',
      sourceReviewedOn: '2026-09-05',
    },
  ],
};

test('collectSeoPaths lists static routes plus every published detail slug', () => {
  const paths = collectSeoPaths(snapshot).map((entry) => entry.path);

  expect(paths).toEqual(
    expect.arrayContaining([
      '/',
      '/updates',
      '/events',
      '/projects',
      '/surveys',
      '/local-info',
      '/get-involved',
      '/updates/first-update',
      '/projects/first-project',
      '/events/first-event',
      '/surveys/first-survey',
      '/local-info/first-resource',
      '/documents/thorntons-bin-collection-schedule-2026.pdf',
    ]),
  );
});

test('collectSeoPaths skips blank slugs and de-duplicates paths', () => {
  const paths = collectSeoPaths({
    ...snapshot,
    updates: [
      { ...snapshot.updates[0]!, slug: '  ' },
      snapshot.updates[0]!,
      snapshot.updates[0]!,
    ],
  }).map((entry) => entry.path);

  expect(paths.filter((path) => path === '/updates/first-update')).toHaveLength(
    1,
  );
  expect(paths).not.toContain('/updates/  ');
});

test('collectSeoPaths omits lastmod for invalid dates and falls back to survey opensOn', () => {
  const paths = collectSeoPaths({
    updates: [
      { ...snapshot.updates[0]!, slug: 'bad-date', publishedOn: '  ' },
      {
        ...snapshot.updates[0]!,
        slug: 'invalid-date',
        publishedOn: 'not-a-date',
      },
    ],
    projects: [],
    events: [],
    surveys: [
      {
        ...snapshot.surveys[0]!,
        slug: 'opens-only',
        closesOn: undefined,
        opensOn: '2026-06-26',
      },
    ],
    resources: [
      {
        ...snapshot.resources[0]!,
        slug: 'no-date',
        sourceReviewedOn: '',
      },
    ],
  });

  const byPath = new Map(paths.map((entry) => [entry.path, entry]));
  expect(byPath.get('/updates/bad-date')).toEqual({
    path: '/updates/bad-date',
  });
  expect(byPath.get('/updates/invalid-date')).toEqual({
    path: '/updates/invalid-date',
  });
  expect(byPath.get('/surveys/opens-only')).toMatchObject({
    lastmod: '2026-06-26',
  });
  expect(byPath.get('/local-info/no-date')).toEqual({
    path: '/local-info/no-date',
  });
});

test('collectSeoPaths ignores non-string slugs without throwing', () => {
  const malformed = JSON.parse(JSON.stringify(snapshot));
  malformed.updates[0].slug = undefined;
  const paths = collectSeoPaths(malformed).map((entry) => entry.path);

  expect(paths).not.toContain('/updates/undefined');
});

test('resolveSeoSiteUrl falls back to production for missing, blank, or non-http values', () => {
  expect(resolveSeoSiteUrl(undefined)).toBe(
    'https://woodbrook.shankill.workers.dev',
  );
  expect(resolveSeoSiteUrl('   ')).toBe(
    'https://woodbrook.shankill.workers.dev',
  );
  expect(resolveSeoSiteUrl('not-a-url')).toBe(
    'https://woodbrook.shankill.workers.dev',
  );
  expect(resolveSeoSiteUrl('ftp://example.com')).toBe(
    'https://woodbrook.shankill.workers.dev',
  );
  expect(resolveSeoSiteUrl(123)).toBe('https://woodbrook.shankill.workers.dev');
});

test('resolveSeoSiteUrl trims whitespace and trailing slashes', () => {
  expect(resolveSeoSiteUrl('  https://example.com/  ')).toBe(
    'https://example.com',
  );
});

test('buildSitemapXml emits valid XML with absolute locations', () => {
  const xml = buildSitemapXml(
    [{ path: '/' }, { path: '/updates/first-update', lastmod: '2026-09-05' }],
    'https://example.com',
  );

  expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
  expect(xml).toContain(
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  );
  expect(xml).toContain('<loc>https://example.com/</loc>');
  expect(xml).toContain('<loc>https://example.com/updates/first-update</loc>');
  expect(xml).toContain('<lastmod>2026-09-05</lastmod>');
});

test('buildSitemapXml escapes ampersands in locations', () => {
  const xml = buildSitemapXml(
    [{ path: '/updates/a&b' }],
    'https://example.com',
  );

  expect(xml).toContain('a&amp;b');
});

test('buildSitemapXml falls back to production origin for invalid site URLs', () => {
  const xml = buildSitemapXml([{ path: '/' }], 'not-a-url');

  expect(xml).toContain('https://woodbrook.shankill.workers.dev/');
});

test('buildRobotsTxt allows crawling and points crawlers at the sitemap', () => {
  const robots = buildRobotsTxt('https://example.com');

  expect(robots).toContain('User-agent: *');
  expect(robots).toContain('Allow: /');
  expect(robots).toContain('Disallow: /concepts/');
  expect(robots).toContain('Sitemap: https://example.com/sitemap.xml');
});

test('buildRobotsTxt falls back to production origin when the site URL is invalid', () => {
  expect(buildRobotsTxt('')).toContain(
    'Sitemap: https://woodbrook.shankill.workers.dev/sitemap.xml',
  );
});

test('createWebsiteJsonLd describes the public website without inventing local facts', () => {
  const jsonLd = createWebsiteJsonLd('https://example.com');

  expect(jsonLd).toMatchObject({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Woodbrook Residents',
    url: 'https://example.com/',
  });
});

test('createWebsiteJsonLd falls back to production origin for invalid site URLs', () => {
  expect(createWebsiteJsonLd('')).toMatchObject({
    url: 'https://woodbrook.shankill.workers.dev/',
  });
});

test('createOrganizationJsonLd exposes brand entity with absolute logo', () => {
  const jsonLd = createOrganizationJsonLd('https://example.com');

  expect(jsonLd).toMatchObject({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Woodbrook Residents',
    url: 'https://example.com/',
    logo: 'https://example.com/apple-touch-icon.png',
  });
});

test('createSiteJsonLdGraph links website publisher to organization', () => {
  const graph = createSiteJsonLdGraph('https://example.com');

  expect(graph).toHaveLength(2);
  expect(graph[0]).toMatchObject({ '@type': 'WebSite' });
  expect(graph[1]).toMatchObject({ '@type': 'Organization' });
});
