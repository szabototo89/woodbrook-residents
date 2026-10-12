import type { ContentSnapshot } from '../features/content/contentTypes';

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
export const sampleSearchSnapshot: ContentSnapshot = {
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
