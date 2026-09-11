import { expect, test } from 'vitest';

import type { Resource } from '../content/contentTypes';
import { getLocalHighlights } from './localHighlightModel';

const resource = (overrides: Partial<Resource> = {}): Resource => ({
  documentId: 'resource-1',
  title: 'Useful local information',
  slug: 'useful-local-information',
  category: 'community',
  serviceType: 'Local information',
  providerType: 'community',
  description: 'Something residents should know.',
  outOfHours: false,
  featured: true,
  details: [],
  collectionDates: [],
  displayOrder: 10,
  sourceName: 'Source',
  sourceUrl: 'https://example.com',
  sourceReviewedOn: '2026-09-11',
  ...overrides,
});

test('local highlights summarises the next featured collection dates and qualification', () => {
  const highlights = getLocalHighlights(
    [
      resource({
        title: 'Thorntons 2026 bin collection schedule',
        serviceType: 'Household bin collections',
        details: [
          {
            id: 1,
            label: 'Applicability',
            value: 'Thorntons customers using this schedule',
            showOnCard: true,
          },
        ],
        collectionDates: [
          { id: 1, date: '2026-09-08', stream: 'waste-compost' },
          { id: 2, date: '2026-09-15', stream: 'recycling' },
          { id: 3, date: '2026-09-22', stream: 'waste-compost' },
        ],
      }),
    ],
    '2026-09-11',
  );

  expect(highlights).toEqual([
    expect.objectContaining({
      actionLabel: 'View full schedule',
      note: 'Thorntons customers using this schedule',
      facts: [
        {
          label: 'Recycling',
          value: '2026-09-15',
          dateTime: '2026-09-15',
        },
        {
          label: 'Waste and compost',
          value: '2026-09-22',
          dateTime: '2026-09-22',
        },
      ],
    }),
  ]);
});

test('local highlights supports featured information without collection dates', () => {
  const highlights = getLocalHighlights(
    [
      resource({
        category: 'transport',
        details: [
          {
            id: 1,
            label: 'Effective from',
            value: 'Monday',
            showOnCard: true,
          },
        ],
      }),
    ],
    '2026-09-11',
  );

  expect(highlights[0]).toMatchObject({
    summary: 'Something residents should know.',
    actionLabel: 'View details',
    facts: [{ label: 'Effective from', value: 'Monday' }],
  });
});

test('local highlights omits ordinary resources and expired schedules', () => {
  expect(
    getLocalHighlights(
      [
        resource({ featured: false }),
        resource({
          documentId: 'expired',
          collectionDates: [{ id: 1, date: '2026-09-01', stream: 'recycling' }],
        }),
      ],
      '2026-09-11',
    ),
  ).toEqual([]);
});
