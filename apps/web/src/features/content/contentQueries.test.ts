import { expect, test } from 'vitest';

import {
  findBySlug,
  getCollection,
  getHomeContentFromSnapshot,
  getSiteSettingFromSnapshot,
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
