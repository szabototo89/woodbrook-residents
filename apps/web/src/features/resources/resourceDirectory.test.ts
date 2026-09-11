import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { Resource } from '../content/contentTypes';
import {
  filterResources,
  getAvailableResourceCategories,
  toTelephoneHref,
} from './resourceDirectory';
import { ResourceDetailValue, isAddressDetail } from './ResourceDetailValue';

const resources: Resource[] = [
  {
    documentId: 'gp',
    title: 'Neighbourhood Practice',
    slug: 'neighbourhood-practice',
    category: 'health',
    serviceType: 'GP practice',
    providerType: 'business',
    description: 'Primary care appointments',
    phone: '01 234 5678',
    outOfHours: false,
    featured: false,
    details: [
      {
        id: 1,
        label: 'Address',
        value: 'Main Street',
        showOnCard: true,
      },
    ],
    collectionDates: [],
    displayOrder: 10,
    sourceName: 'Practice website',
    sourceUrl: 'https://example.com/gp',
    sourceReviewedOn: '2026-09-07',
  },
  {
    documentId: 'locksmith',
    title: 'Local Locks',
    slug: 'local-locks',
    category: 'trades',
    serviceType: 'Locksmith',
    providerType: 'business',
    description: 'Door and window lock repairs',
    phone: '086 123 4567',
    outOfHours: true,
    featured: false,
    details: [
      {
        id: 2,
        label: 'Coverage',
        value: 'South Dublin',
        showOnCard: true,
      },
    ],
    collectionDates: [],
    displayOrder: 20,
    sourceName: 'Local Locks',
    sourceUrl: 'https://example.com/locks',
    sourceReviewedOn: '2026-09-07',
  },
];

const detailAt = (resourceIndex: number) => {
  const detail = resources[resourceIndex]?.details[0];
  if (!detail) {
    throw new Error(`Missing detail fixture at index ${resourceIndex}`);
  }
  return detail;
};

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

  it('creates a dialable link from a formatted phone number', () => {
    expect(toTelephoneHref('+353 (0)1 234 5678')).toBe('tel:+353012345678');
  });

  it('identifies address details without depending on label casing', () => {
    expect(isAddressDetail(detailAt(0))).toBe(true);
    expect(isAddressDetail(detailAt(1))).toBe(false);
  });

  it('links address details to a Google Maps search', () => {
    const markup = renderToStaticMarkup(
      createElement(ResourceDetailValue, {
        detail: detailAt(0),
      }),
    );

    expect(markup).toContain('https://www.google.com/maps/search/');
    expect(markup).toContain('Main Street');
  });

  it('renders other details as plain text', () => {
    const markup = renderToStaticMarkup(
      createElement(ResourceDetailValue, {
        detail: detailAt(1),
      }),
    );

    expect(markup).toBe('South Dublin');
  });
});
