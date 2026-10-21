import { expect, test } from 'vitest';

import {
  findBySlug,
  getCollection,
  getHomeContentFromSnapshot,
  getSiteSettingFromSnapshot,
  getUpdatesFromSnapshot,
} from './contentQueries';
import type { CommunityEvent, ContentSnapshot, Update } from './contentTypes';

const update = (index: number): Update => ({
  documentId: `update-${index}`,
  slug: `update-${index}`,
  title: `Update ${index}`,
  kind: 'news',
  summary: 'Summary',
  body: 'Body',
  publishedOn: '2026-09-09',
  sourceName: 'Source',
  sourceUrl: 'https://example.com',
  sourceReviewedOn: '2026-09-09',
  featured: false,
});

const homeEvent = (
  documentId: string,
  startsAt: string,
  featured = false,
): CommunityEvent => ({
  documentId,
  title: `Event ${documentId}`,
  slug: `event-${documentId}`,
  summary: 'Summary',
  startsAt,
  location: 'Shankill',
  sourceUrl: 'https://example.com',
  sourceReviewedOn: '2026-09-10',
  featured,
});

const snapshot: ContentSnapshot = {
  updates: Array.from({ length: 30 }, (_, index) => update(index)),
  projects: [],
  events: [],
  surveys: [],
  resources: [],
};

test('content queries selects the first three items for homepage collections', () => {
  expect(getHomeContentFromSnapshot(snapshot).updates).toHaveLength(3);
});

const unorderedUpdates = [
  { ...update(0), publishedOn: '2025-12-31', featured: true },
  { ...update(1), publishedOn: '2026-01-02' },
  { ...update(2), publishedOn: '2026-02-01' },
  { ...update(3), publishedOn: '2026-10-01' },
];

test('homepage selects the three newest news articles by publication date', () => {
  const home = getHomeContentFromSnapshot({
    ...snapshot,
    updates: unorderedUpdates,
  });

  expect(home.updates.map((item) => item.title)).toEqual([
    'Update 3',
    'Update 2',
    'Update 1',
  ]);
});

test('news listing sorts by publication date before limiting without changing source order', () => {
  const content = { ...snapshot, updates: unorderedUpdates };

  expect(
    getCollection(getUpdatesFromSnapshot(content), 2).map((item) => item.title),
  ).toEqual(['Update 3', 'Update 2']);
  expect(content.updates.map((item) => item.title)).toEqual([
    'Update 0',
    'Update 1',
    'Update 2',
    'Update 3',
  ]);
});

test('news ordering handles empty collections and preserves order for equal publication dates', () => {
  expect(getUpdatesFromSnapshot({ ...snapshot, updates: [] })).toEqual([]);
  expect(getUpdatesFromSnapshot(snapshot)).toEqual(snapshot.updates);
});

test('news ordering compares publication instants across date-time offsets', () => {
  const updates = [
    { ...update(0), publishedOn: '2026-10-01T10:00:00+02:00' },
    { ...update(1), publishedOn: '2026-10-01T09:00:00Z' },
  ];

  expect(
    getUpdatesFromSnapshot({ ...snapshot, updates }).map((item) => item.title),
  ).toEqual(['Update 1', 'Update 0']);
});

test('content queries keeps only future events for the homepage', () => {
  const now = '2026-09-18T12:00:00.000Z';
  const home = getHomeContentFromSnapshot(
    {
      ...snapshot,
      events: [
        homeEvent('past', '2026-09-12T18:00:00.000Z'),
        homeEvent('later', '2026-09-25T18:00:00.000Z'),
        homeEvent('next', '2026-09-20T18:00:00.000Z'),
      ],
    },
    now,
  );

  expect(home.events.map((event) => event.documentId)).toEqual([
    'next',
    'later',
  ]);
});

test('content queries limits public collection responses without changing the snapshot', () => {
  expect(getCollection(snapshot.updates)).toHaveLength(25);
  expect(snapshot.updates).toHaveLength(30);
});

test('content queries finds canonical content by slug', () => {
  expect(findBySlug(snapshot.updates, 'update-4')?.documentId).toBe('update-4');
  expect(findBySlug(snapshot.updates, 'missing')).toBeUndefined();
});

test('content queries reads the optional site setting from the snapshot', () => {
  expect(getSiteSettingFromSnapshot(snapshot)).toBeUndefined();
  expect(
    getSiteSettingFromSnapshot({
      ...snapshot,
      siteSetting: {
        name: 'Woodbrook',
        location: 'Shankill',
        tagline: 'Tagline',
        introduction: 'Introduction',
      },
    }),
  ).toEqual({
    name: 'Woodbrook',
    location: 'Shankill',
    tagline: 'Tagline',
    introduction: 'Introduction',
  });
});
