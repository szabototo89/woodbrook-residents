import { expect, test } from 'vitest';

import type { ContentSnapshot } from '../content/contentTypes';
import {
  buildSearchIndex,
  parseSearchParams,
  searchContent,
  searchCategories,
} from './searchModel';

const source = {
  sourceName: 'Sample source',
  sourceUrl: 'https://example.com',
  sourceReviewedOn: '2026-10-12',
};
const base = {
  documentId: 'sample',
  slug: 'sample',
  title: 'Sample DART information',
  summary: 'Accessible transport',
  featured: false,
  ...source,
};
const snapshot: ContentSnapshot = {
  updates: [
    {
      ...base,
      kind: 'transport',
      body: 'Step-free platforms',
      publishedOn: '2026-10-12',
      imagePath: '/images/sample.jpg',
    },
  ],
  projects: [
    {
      ...base,
      category: 'transport',
      stage: 'monitoring',
      details: 'Coastal route',
      updatedOn: '2026-10-11',
    },
  ],
  events: [
    {
      ...base,
      startsAt: '2026-11-07T19:00:00Z',
      endsAt: '2026-11-07T20:30:00Z',
      location: 'Sample venue',
    },
  ],
  resources: [
    {
      ...base,
      category: 'transport',
      serviceType: 'Rail',
      providerType: 'public-service',
      description: 'Timetables and fares',
      outOfHours: false,
      details: [
        { id: 1, label: 'Station', value: 'Sample stop', showOnCard: true },
      ],
      collectionDates: [],
      displayOrder: 1,
    },
  ],
  surveys: [{ ...base, stage: 'closed' }],
};

test('places services immediately after all results', () => {
  expect(searchCategories.map((category) => category.label)).toEqual([
    'All',
    'Services',
    'Updates',
    'Projects',
    'Events',
  ]);
});

test('validates URL state and bounds the search input', () => {
  expect(parseSearchParams({ q: '  DART  ', category: 'events' })).toEqual({
    q: 'DART',
    category: 'events',
  });
  expect(parseSearchParams({ q: 42, category: 'unknown' })).toEqual({
    q: '',
    category: 'all',
  });
  expect(
    parseSearchParams({ q: 'a'.repeat(150), category: 'all' }).q,
  ).toHaveLength(120);
});

test('indexes every published collection with canonical destinations and truthful status', () => {
  const index = buildSearchIndex(snapshot, '2026-10-12T00:00:00Z');
  expect(index.map((item) => item.href)).toEqual([
    '/updates/sample',
    '/surveys/sample',
    '/projects/sample',
    '/events/sample',
    '/local-info/sample',
  ]);
  expect(index.map((item) => item.badge)).toEqual([
    'Local update',
    'Consultation closed',
    'Monitoring project',
    'Upcoming event',
    'Local service',
  ]);
  expect(index[0]?.imagePath).toBe('/images/sample.jpg');
  expect(index[3]?.event).toMatchObject({
    location: 'Sample venue',
    endsAt: '2026-11-07T20:30:00Z',
  });
  expect(new Set(index.map((item) => item.id)).size).toBe(5);
  expect(
    buildSearchIndex(
      {
        ...snapshot,
        events: [
          {
            ...snapshot.events[0]!,
            startsAt: '2024-01-01T12:00:00Z',
            endsAt: undefined,
          },
        ],
        surveys: [{ ...snapshot.surveys[0]!, stage: 'open' }],
      },
      '2026-10-12T00:00:00Z',
    )[3]?.badge,
  ).toBe('Past event');
});

test('matches all words case-insensitively across visible copy and full content', () => {
  const index = buildSearchIndex(snapshot, '2026-10-12T00:00:00Z');
  expect(searchContent(index, { q: 'dArT', category: 'all' }).counts).toEqual({
    all: 5,
    updates: 2,
    projects: 1,
    events: 1,
    services: 1,
  });
  expect(
    searchContent(index, {
      q: 'step-free platforms',
      category: 'all',
    }).results.map((item) => item.href),
  ).toEqual(['/updates/sample']);
  expect(
    searchContent(index, { q: 'sample stop', category: 'all' }).results.map(
      (item) => item.category,
    ),
  ).toEqual(['services']);
  expect(
    searchContent(index, { q: 'DART impossible', category: 'all' }).results,
  ).toEqual([]);
});

test('category filtering preserves query-wide counts and does not mutate the index', () => {
  const index = buildSearchIndex(snapshot, '2026-10-12T00:00:00Z');
  const result = searchContent(index, { q: 'DART', category: 'projects' });
  expect(result.results.map((item) => item.href)).toEqual(['/projects/sample']);
  expect(result.counts.all).toBe(5);
  expect(index).toHaveLength(5);
  expect(searchContent(index, { q: '', category: 'all' }).counts.all).toBe(0);
});
