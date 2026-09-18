import { expect, test } from 'vitest';

import {
  composeLocalInfoDescription,
  createArticleJsonLd,
  createBreadcrumbJsonLd,
  createEventJsonLd,
  createLocalServiceJsonLd,
  createProjectJsonLd,
  createSurveyJsonLd,
} from './seoStructuredData';

test('createArticleJsonLd describes a published update for rich results', () => {
  const jsonLd = createArticleJsonLd({
    siteUrl: 'https://example.com',
    path: '/updates/first-update',
    headline: 'First update',
    description: 'Summary.',
    datePublished: '2026-09-05',
    dateModified: '2026-09-06',
  });

  expect(jsonLd).toMatchObject({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'First update',
    description: 'Summary.',
    mainEntityOfPage: 'https://example.com/updates/first-update',
    datePublished: '2026-09-05T00:00:00.000Z',
    dateModified: '2026-09-06T00:00:00.000Z',
  });
});

test('createArticleJsonLd omits image and dates when they are missing or invalid', () => {
  const jsonLd = createArticleJsonLd({
    siteUrl: 'https://example.com',
    path: '/updates/first-update',
    headline: 'First update',
    description: 'Summary.',
    imagePath: 'not-a-url',
    datePublished: 'not-a-date',
  });

  expect(jsonLd).not.toHaveProperty('image');
  expect(jsonLd).not.toHaveProperty('datePublished');
});

test('createArticleJsonLd resolves a relative image path against the site origin', () => {
  const jsonLd = createArticleJsonLd({
    siteUrl: 'https://example.com',
    path: '/updates/first-update',
    headline: 'First update',
    description: 'Summary.',
    imagePath: '/images/example.jpg',
  });

  expect(jsonLd).toMatchObject({
    image: 'https://example.com/images/example.jpg',
  });
});

test('createEventJsonLd describes a scheduled community event', () => {
  const jsonLd = createEventJsonLd({
    siteUrl: 'https://example.com',
    path: '/events/first-event',
    name: 'First event',
    description: 'Summary.',
    startDate: '2026-09-12T17:00:00.000Z',
    endDate: '2026-09-12T19:00:00.000Z',
    locationName: 'Shanganagh Park',
  });

  expect(jsonLd).toMatchObject({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'First event',
    startDate: '2026-09-12T17:00:00.000Z',
    endDate: '2026-09-12T19:00:00.000Z',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: 'Shanganagh Park',
    },
  });
});

test('createEventJsonLd omits end date and location when they are missing', () => {
  const jsonLd = createEventJsonLd({
    siteUrl: 'https://example.com',
    path: '/events/first-event',
    name: 'First event',
    description: 'Summary.',
    startDate: '2026-09-12T17:00:00.000Z',
  });

  expect(jsonLd).not.toHaveProperty('endDate');
  expect(jsonLd).not.toHaveProperty('location');
});

test('createArticleJsonLd keeps absolute https images and drops non-http ones', () => {
  const absolute = createArticleJsonLd({
    siteUrl: 'https://example.com',
    path: '/updates/first-update',
    headline: 'First update',
    description: 'Summary.',
    imagePath: 'https://cdn.example.com/photo.jpg',
  });
  expect(absolute).toMatchObject({
    image: 'https://cdn.example.com/photo.jpg',
  });

  const nonHttp = createArticleJsonLd({
    siteUrl: 'https://example.com',
    path: '/updates/first-update',
    headline: 'First update',
    description: 'Summary.',
    imagePath: 'ftp://example.com/photo.jpg',
  });
  expect(nonHttp).not.toHaveProperty('image');
});

test('createEventJsonLd keeps absolute images and drops invalid end dates', () => {
  const jsonLd = createEventJsonLd({
    siteUrl: 'https://example.com',
    path: '/events/first-event',
    name: 'First event',
    description: 'Summary.',
    startDate: '2026-09-12T17:00:00.000Z',
    endDate: 'not-a-date',
    locationName: '   ',
    imagePath: 'https://cdn.example.com/event.jpg',
  });

  expect(jsonLd).toMatchObject({
    image: 'https://cdn.example.com/event.jpg',
  });
  expect(jsonLd).not.toHaveProperty('endDate');
  expect(jsonLd).not.toHaveProperty('location');
});

test('createEventJsonLd falls back to the production origin for invalid inputs', () => {
  const jsonLd = createEventJsonLd({
    siteUrl: 'not-a-url',
    path: '/events/first-event',
    name: 'First event',
    description: 'Summary.',
    startDate: 'not-a-date',
  });

  expect(jsonLd).toMatchObject({
    url: 'https://woodbrook.shankill.workers.dev/events/first-event',
  });
  expect(jsonLd).not.toHaveProperty('startDate');
});

test('createBreadcrumbJsonLd lists home, section, and detail with absolute urls', () => {
  const jsonLd = createBreadcrumbJsonLd({
    siteUrl: 'https://example.com',
    items: [
      { name: 'Home', path: '/' },
      { name: 'Local information', path: '/local-info' },
      { name: 'Shankill Garda Station', path: '/local-info/shankill-garda' },
    ],
  });

  expect(jsonLd).toMatchObject({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { position: 1, name: 'Home', item: 'https://example.com/' },
      { position: 2, name: 'Local information' },
      { position: 3, name: 'Shankill Garda Station' },
    ],
  });
});

test('createProjectJsonLd describes project without inventing facts', () => {
  const jsonLd = createProjectJsonLd({
    siteUrl: 'https://example.com',
    path: '/projects/first-project',
    headline: 'First project',
    description: 'Summary.',
    dateModified: '2026-09-06',
  });

  expect(jsonLd).toMatchObject({
    '@type': 'Article',
    headline: 'First project',
    mainEntityOfPage: 'https://example.com/projects/first-project',
  });
});

test('createSurveyJsonLd describes consultation with dates only when valid', () => {
  const jsonLd = createSurveyJsonLd({
    siteUrl: 'https://example.com',
    path: '/surveys/first-survey',
    headline: 'First survey',
    description: 'Summary.',
    datePublished: '2026-06-26',
    dateModified: '2026-07-24',
  });

  expect(jsonLd).toMatchObject({ '@type': 'Article' });
  expect(jsonLd).not.toHaveProperty('image');
});

test('createLocalServiceJsonLd uses only provided phone and address', () => {
  const jsonLd = createLocalServiceJsonLd({
    siteUrl: 'https://example.com',
    path: '/local-info/shankill-garda',
    name: 'Shankill Garda Station',
    description: 'Local Garda station.',
    phone: '01 666 5900',
    address: 'Dorney Court, Shankill',
    url: 'https://www.garda.ie/shankill.html',
  });

  expect(jsonLd).toMatchObject({
    '@type': 'GovernmentOffice',
    telephone: '01 666 5900',
  });
  expect(JSON.stringify(jsonLd)).not.toContain('999');
});

test('composeLocalInfoDescription prevents button concatenation with complete sentence', () => {
  const description = composeLocalInfoDescription({
    description: 'Local Garda station at Dorney Court, Shankill.',
    phone: '01 666 5900',
    address: 'Dorney Court, Shankill, Co. Dublin, D18 CD50',
  });

  expect(description.length).toBeLessThanOrEqual(155);
  expect(description.endsWith('.')).toBe(true);
  expect(description).toContain('01 666 5900.');
  expect(description).not.toContain('5900Visit');
  expect(description).toContain('Call 01 666 5900.');
});

test('composeLocalInfoDescription handles plain and overlong descriptions', () => {
  expect(composeLocalInfoDescription({ description: 'Helpful service' })).toBe(
    'Helpful service.',
  );

  const long = composeLocalInfoDescription({
    description: `${'Very helpful local service. '.repeat(10)} Call us anytime.`,
    address: 'Somewhere else entirely',
  });
  expect(long.length).toBeLessThanOrEqual(155);
  expect(long.endsWith('...')).toBe(true);
});

test('composeLocalInfoDescription skips the visit note when already mentioned', () => {
  const description = composeLocalInfoDescription({
    description: 'Visit us at Main Street during opening hours',
    address: 'Main Street',
  });

  expect(description).not.toContain('Visit Main Street.');
});

test('createLocalServiceJsonLd omits missing contact details', () => {
  const jsonLd = createLocalServiceJsonLd({
    siteUrl: 'https://example.com',
    path: '/local-info/example',
    name: 'Example',
    description: 'Example service.',
  });

  expect(jsonLd).not.toHaveProperty('telephone');
  expect(jsonLd).not.toHaveProperty('address');
  expect(jsonLd).not.toHaveProperty('sameAs');
});

test('createProjectJsonLd keeps images and drops invalid dates', () => {
  const jsonLd = createProjectJsonLd({
    siteUrl: 'https://example.com',
    path: '/projects/example',
    headline: 'Example',
    description: 'Summary.',
    imagePath: '/images/example.jpg',
    dateModified: 'not-a-date',
  });

  expect(jsonLd).toMatchObject({
    image: 'https://example.com/images/example.jpg',
  });
  expect(jsonLd).not.toHaveProperty('dateModified');
});

test('createSurveyJsonLd keeps images alongside valid dates', () => {
  const jsonLd = createSurveyJsonLd({
    siteUrl: 'https://example.com',
    path: '/surveys/example',
    headline: 'Example',
    description: 'Summary.',
    imagePath: 'https://cdn.example.com/survey.jpg',
    datePublished: '2026-06-26',
    dateModified: '2026-07-24',
  });

  expect(jsonLd).toMatchObject({
    image: 'https://cdn.example.com/survey.jpg',
    datePublished: '2026-06-26T00:00:00.000Z',
  });
});

test('structured data helpers ignore non-string inputs', () => {
  const jsonLd = createArticleJsonLd({
    siteUrl: 'https://example.com',
    path: '/updates/example',
    headline: 'Example',
    description: 'Summary.',
    imagePath: 123,
    datePublished: 123,
    dateModified: '   ',
  });

  expect(jsonLd).not.toHaveProperty('image');
  expect(jsonLd).not.toHaveProperty('datePublished');
  expect(jsonLd).not.toHaveProperty('dateModified');

  expect(
    composeLocalInfoDescription({
      description: 'Helpful service.',
      phone: 123,
      address: 123,
    }),
  ).toBe('Helpful service.');
});
