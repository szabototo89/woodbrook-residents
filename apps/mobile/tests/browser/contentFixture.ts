import type { ContentSnapshot } from '../../src/features/content/contentTypes.js';

export const contentFixture: ContentSnapshot = {
  siteSetting: {
    name: 'Woodbrook Residents',
    location: 'Shankill',
    tagline: 'Local information',
    introduction: 'Welcome',
    contactEmail: 'hello@example.com',
  },
  updates: [],
  projects: [
    {
      documentId: 'project-1',
      title: 'Green space project',
      slug: 'green-space',
      category: 'Public realm',
      stage: 'Active',
      summary: 'Work is under way.',
      details: 'Project details.',
      updatedOn: '2026-08-20',
      nextStep: 'Review the next update.',
      sourceName: 'Test council source',
      sourceUrl: 'https://example.com/project',
      sourceReviewedOn: '2026-08-21',
      featured: true,
    },
  ],
  events: [],
  surveys: [],
  resources: [],
};
