import { describe, expect, it } from 'vitest';

import {
  findBySlug,
  getCollection,
  getHomeContentFromSnapshot,
  getSiteSettingFromSnapshot,
} from './contentQueries';
import type { ContentSnapshot, Update } from './contentTypes';

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

const snapshot: ContentSnapshot = {
  updates: Array.from({ length: 30 }, (_, index) => update(index)),
  projects: [],
  events: [],
  surveys: [],
  resources: [],
};

describe('content queries', () => {
  it('selects the first three items for homepage collections', () => {
    expect(getHomeContentFromSnapshot(snapshot).updates).toHaveLength(3);
  });

  it('limits public collection responses without changing the snapshot', () => {
    expect(getCollection(snapshot.updates)).toHaveLength(25);
    expect(snapshot.updates).toHaveLength(30);
  });

  it('finds canonical content by slug', () => {
    expect(findBySlug(snapshot.updates, 'update-4')?.documentId).toBe(
      'update-4',
    );
    expect(findBySlug(snapshot.updates, 'missing')).toBeUndefined();
  });

  it('reads the optional site setting from the snapshot', () => {
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
});
