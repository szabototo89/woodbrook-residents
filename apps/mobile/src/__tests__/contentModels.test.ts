import { expect, test } from 'vitest';

import {
  filterResources,
  getResourceCategories,
  getCollectionModel,
  getDetailModel,
} from '../features/content/contentModels.js';
import type { ContentSnapshot } from '../features/content/contentTypes.js';

const optionalContent: ContentSnapshot = {
  updates: [],
  projects: [
    {
      documentId: 'p',
      title: 'Project',
      slug: 'project',
      category: 'Planning',
      stage: 'Monitoring',
      summary: 'Summary',
      details: 'Details',
      updatedOn: '2026-01-01',
      sourceName: 'Council',
      sourceUrl: 'https://example.com/p',
      sourceReviewedOn: '2026-01-02',
      featured: false,
    },
  ],
  events: [
    {
      documentId: 'e',
      title: 'Event',
      slug: 'event',
      summary: 'Summary',
      startsAt: '2026-02-01',
      location: 'Woodbrook',
      sourceUrl: 'https://example.com/e',
      sourceReviewedOn: '2026-02-02',
    },
  ],
  surveys: [
    {
      documentId: 's',
      title: 'Survey',
      slug: 'survey',
      stage: 'Closed',
      summary: 'Summary',
      sourceName: 'Council',
      sourceUrl: 'https://example.com/s',
      sourceReviewedOn: '2026-03-01',
    },
  ],
  resources: [
    {
      documentId: 'r',
      title: 'Bins',
      slug: 'bins',
      category: 'Waste',
      serviceType: 'Collections',
      providerType: 'Public service',
      description: 'Dates',
      outOfHours: false,
      featured: false,
      details: [],
      collectionDates: [{ id: 1, date: '2026-04-01', stream: 'waste-compost' }],
      displayOrder: 1,
      sourceName: 'Council',
      sourceUrl: 'https://example.com/r',
      sourceReviewedOn: '2026-03-20',
    },
  ],
};

test('content models preserve optional and closed content behavior', () => {
  expect(getCollectionModel(optionalContent, 'updates').cards).toEqual([]);
  expect(getCollectionModel(optionalContent, 'projects').cards[0]?.meta).toBe(
    'Monitoring · Planning',
  );
  expect(
    getCollectionModel(optionalContent, 'events').cards[0]?.meta,
  ).toContain('Woodbrook');
  expect(getCollectionModel(optionalContent, 'surveys').cards[0]?.meta).toBe(
    'Closed',
  );
  expect(getCollectionModel(optionalContent, 'resources').cards[0]?.title).toBe(
    'Bins',
  );

  expect(
    getDetailModel(optionalContent, 'projects', 'project')?.facts,
  ).toHaveLength(1);
  expect(
    getDetailModel(optionalContent, 'events', 'event')?.action,
  ).toBeUndefined();
  expect(
    getDetailModel(optionalContent, 'surveys', 'survey')?.action,
  ).toBeUndefined();
  expect(
    getDetailModel(optionalContent, 'resources', 'bins')?.facts,
  ).toContainEqual({
    label: 'Waste & compost',
    value: '1 Apr 2026',
  });
  expect(getDetailModel(optionalContent, 'updates', 'missing')).toBeUndefined();
  expect(
    getDetailModel(optionalContent, 'projects', 'missing'),
  ).toBeUndefined();
  expect(getDetailModel(optionalContent, 'events', 'missing')).toBeUndefined();
  expect(getDetailModel(optionalContent, 'surveys', 'missing')).toBeUndefined();
  expect(
    getDetailModel(optionalContent, 'resources', 'missing'),
  ).toBeUndefined();
});

test('local information filters by search, category, and out-of-hours support', () => {
  const resources = [
    ...optionalContent.resources,
    {
      ...optionalContent.resources[0]!,
      documentId: 'h',
      slug: 'health',
      title: 'Night pharmacy',
      category: 'Health',
      outOfHours: true,
    },
  ];

  expect(getResourceCategories(resources)).toEqual(['Health', 'Waste']);
  expect(filterResources(resources, 'pharmacy', 'all', false)).toHaveLength(1);
  expect(filterResources(resources, '', 'Waste', false)).toHaveLength(1);
  expect(filterResources(resources, '', 'all', true)[0]?.title).toBe(
    'Night pharmacy',
  );
  expect(filterResources(resources, 'missing', 'all', false)).toEqual([]);
});
