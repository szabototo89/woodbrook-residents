import { expect, test } from 'vitest';
import {
  createSearchIndex,
  searchPublicContent,
  parseSearchQuery,
} from './siteSearch';
import type { ContentSnapshot } from '../content/contentTypes';

const snapshot: ContentSnapshot = {
  updates: [
    {
      documentId: 'u',
      title: 'DART opens',
      slug: 'dart',
      summary: 'New station',
      body: 'Train journeys',
      kind: 'transport',
      publishedOn: '2026-09-01',
      sourceName: 'Source',
      sourceUrl: 'https://example.com',
      sourceReviewedOn: '2026-09-01',
      featured: false,
    },
  ],
  projects: [
    {
      documentId: 'p',
      title: 'Park project',
      slug: 'park',
      summary: 'Walking routes',
      details: 'Accessible paths',
      category: 'parks',
      stage: 'active',
      updatedOn: '2026-09-01',
      sourceName: 'Source',
      sourceUrl: 'https://example.com',
      sourceReviewedOn: '2026-09-01',
      featured: false,
    },
  ],
  events: [
    {
      documentId: 'e',
      title: 'Library event',
      slug: 'library',
      summary: 'Meet neighbours',
      startsAt: '2030-09-01T10:00:00Z',
      location: 'Shankill',
      sourceUrl: 'https://example.com',
      sourceReviewedOn: '2026-09-01',
      featured: false,
    },
  ],
  surveys: [
    {
      documentId: 's',
      title: 'Park consultation',
      slug: 'park-survey',
      summary: 'Have your say on paths',
      stage: 'open',
      sourceName: 'Source',
      sourceUrl: 'https://example.com',
      sourceReviewedOn: '2026-09-01',
    },
  ],
  resources: [
    {
      documentId: 'r',
      title: 'Family GP',
      slug: 'gp',
      description: 'Healthcare in Shankill',
      category: 'health',
      serviceType: 'GP',
      providerType: 'public-service',
      outOfHours: false,
      featured: false,
      details: [],
      collectionDates: [],
      displayOrder: 0,
      sourceName: 'Source',
      sourceUrl: 'https://example.com',
      sourceReviewedOn: '2026-09-01',
    },
  ],
};

test('search indexes only the five public collections with canonical detail URLs', () => {
  expect(createSearchIndex(snapshot).map((result) => result.href)).toEqual([
    '/updates/dart',
    '/projects/park',
    '/events/library',
    '/surveys/park-survey',
    '/local-info/gp',
  ]);
});

test('search matches all words across titles and descriptions without case sensitivity', () => {
  const index = createSearchIndex(snapshot);
  expect(
    searchPublicContent(index, '  SHANKILL healthcare ').map(
      (result) => result.title,
    ),
  ).toEqual(['Family GP']);
  expect(
    searchPublicContent(index, 'park').map((result) => result.type),
  ).toEqual(['Project', 'Consultation']);
  expect(searchPublicContent(index, 'no match')).toEqual([]);
  expect(searchPublicContent(index, '   ')).toEqual([]);
});

test('search accepts only bounded text query input', () => {
  expect(parseSearchQuery(undefined)).toBe('');
  expect(parseSearchQuery(42)).toBe('');
  expect(parseSearchQuery('a'.repeat(200))).toHaveLength(120);
  expect(parseSearchQuery('  park  ')).toBe('park');
});
