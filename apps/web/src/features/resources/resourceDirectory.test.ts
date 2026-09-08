import { describe, expect, it } from 'vitest';

import type { Resource } from '../content/contentTypes';
import {
  filterResources,
  getAvailableResourceCategories,
} from './resourceDirectory';

const resources: Resource[] = [
  {
    documentId: 'gp',
    title: 'Neighbourhood Practice',
    category: 'health',
    serviceType: 'GP practice',
    providerType: 'business',
    description: 'Primary care appointments',
    phone: '01 234 5678',
    outOfHours: false,
    details: [{ id: 1, label: 'Address', value: 'Main Street' }],
    displayOrder: 10,
    sourceName: 'Practice website',
    sourceUrl: 'https://example.com/gp',
    sourceReviewedOn: '2026-09-07',
  },
  {
    documentId: 'locksmith',
    title: 'Local Locks',
    category: 'trades',
    serviceType: 'Locksmith',
    providerType: 'business',
    description: 'Door and window lock repairs',
    phone: '086 123 4567',
    outOfHours: true,
    details: [{ id: 2, label: 'Coverage', value: 'South Dublin' }],
    displayOrder: 20,
    sourceName: 'Local Locks',
    sourceUrl: 'https://example.com/locks',
    sourceReviewedOn: '2026-09-07',
  },
];

describe('resource directory', () => {
  it('finds contacts using names, service types, and dynamic details', () => {
    expect(filterResources(resources, 'gp', 'all', false)).toEqual([
      resources[0],
    ]);
    expect(filterResources(resources, 'south dublin', 'all', false)).toEqual([
      resources[1],
    ]);
  });

  it('combines category and out-of-hours filters', () => {
    expect(filterResources(resources, '', 'trades', true)).toEqual([
      resources[1],
    ]);
    expect(filterResources(resources, '', 'health', true)).toEqual([]);
  });

  it('only presents categories that contain contacts', () => {
    expect(getAvailableResourceCategories(resources)).toEqual([
      'health',
      'trades',
    ]);
  });
});
