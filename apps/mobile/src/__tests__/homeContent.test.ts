import { expect, test } from 'vitest';

import { homeActions } from '../features/home/homeContent.js';

test('home actions match the existing web destinations without adding features', () => {
  expect(homeActions).toEqual([
    {
      eyebrow: 'Find practical help',
      title: 'Browse local information',
      description:
        'Useful places, services, contacts, and everyday essentials.',
      destination: '/local-info',
      route: { name: 'collection', collection: 'resources' },
    },
    {
      eyebrow: 'Stay informed',
      title: 'Read local updates',
      description: 'Source-linked local updates and practical next steps.',
      destination: '/updates',
      route: { name: 'collection', collection: 'updates' },
    },
    {
      eyebrow: 'Take part',
      title: 'Find upcoming events',
      description: 'Local dates and ways to take part.',
      destination: '/events',
      route: { name: 'collection', collection: 'events' },
    },
    {
      eyebrow: 'Have your say',
      title: 'View public consultations',
      description:
        'Current opportunities to respond and an archive of closed consultations.',
      destination: '/surveys',
      route: { name: 'collection', collection: 'surveys' },
    },
  ]);
});
