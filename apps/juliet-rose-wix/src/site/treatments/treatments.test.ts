import { expect, test } from 'vitest';

import {
  CATEGORY_CARDS,
  PREVIEW_TREATMENTS,
  bookTreatmentUrl,
  formatFeaturedDuration,
  formatTreatmentDuration,
  formatTreatmentPrice,
  parseFeaturedSlugs,
  resolveFeatured,
  toCardTreatment,
} from './treatments';

test('formats sub-hour durations in minutes', () => {
  expect(formatTreatmentDuration(30)).toBe('30 min');
});

test('formats whole-hour durations without minutes', () => {
  expect(formatTreatmentDuration(60)).toBe('1 hr');
});

test('formats hour-plus durations with remaining minutes', () => {
  expect(formatTreatmentDuration(90)).toBe('1 hr 30 min');
});

test('formats prices in whole euro', () => {
  expect(formatTreatmentPrice(8000)).toBe('€80');
});

test('editor preview covers every category with researched treatments', () => {
  const categories = new Set(PREVIEW_TREATMENTS.map((item) => item.category));
  expect(categories).toEqual(
    new Set(['Massage', 'Facials & skin', 'Beauty essentials', 'Packages']),
  );
  expect(
    PREVIEW_TREATMENTS.find(
      (item) => item.slug === 'juliet-rose-signature-facial',
    ),
  ).toMatchObject({ name: 'Juliet Rose Signature Facial', priceCents: 9500 });
});

test('maps a bookings service to a card treatment with a booking link', () => {
  const treatment = toCardTreatment({
    id: 'service-id',
    name: 'Swedish massage',
    slug: 'swedish-massage',
    categoryName: 'Massage',
    durationMinutes: 60,
    priceCents: 8000,
  });

  expect(treatment).toMatchObject({
    slug: 'swedish-massage',
    name: 'Swedish massage',
    category: 'Massage',
  });
  expect(treatment ? bookTreatmentUrl(treatment) : '').toBe(
    '/book?service=swedish-massage',
  );
});

test('drops bookings services with an unknown category', () => {
  expect(
    toCardTreatment({
      id: 'service-id',
      name: 'Mystery service',
      slug: 'mystery-service',
    }),
  ).toBeNull();
});

test('category cards cover every category with researched links', () => {
  const ids = CATEGORY_CARDS.map((card) => card.href);
  expect(ids).toEqual([
    '/treatments#facials-and-skin',
    '/treatments#massage',
    '/treatments#beauty-essentials',
    '/treatments#packages',
  ]);
});

test('featured slugs default to the researched popular choices', () => {
  expect(parseFeaturedSlugs()).toEqual([
    'juliet-rose-signature-facial',
    'microneedling',
    'deep-hydration-6-step-facial',
    'swedish-massage',
  ]);
  expect(parseFeaturedSlugs('swedish-massage, microneedling')).toEqual([
    'swedish-massage',
    'microneedling',
  ]);
});

test('featured durations spell out hour like the home page', () => {
  expect(formatFeaturedDuration(60)).toBe('1 hour');
  expect(formatFeaturedDuration(90)).toBe('1 hour 30 min');
  expect(formatFeaturedDuration(45)).toBe('45 min');
});

test('resolves featured treatments with their researched imagery', () => {
  const featured = resolveFeatured(PREVIEW_TREATMENTS, [
    'juliet-rose-signature-facial',
    'swedish-massage',
  ]);

  expect(featured.map((item) => item.treatment.slug)).toEqual([
    'juliet-rose-signature-facial',
    'swedish-massage',
  ]);
  expect(featured[0]).toMatchObject({
    image: '/images/facial-mask.jpg',
    imageAlt: 'Juliet Rose Signature Facial treatment',
  });
});

test('skips featured slugs missing from the loaded treatments', () => {
  expect(resolveFeatured(PREVIEW_TREATMENTS, ['no-such-slug'])).toEqual([]);
});

test('card treatment keeps a collection image URL in the same shape', () => {
  const treatment = toCardTreatment({
    id: 'service-id',
    name: 'Swedish massage',
    slug: 'swedish-massage',
    categoryName: 'Massage',
    durationMinutes: 60,
    priceCents: 8000,
    imageUrl: 'https://static.wixstatic.com/media/cms-swedish.jpg',
  });
  expect(treatment).toMatchObject({
    slug: 'swedish-massage',
    imageUrl: 'https://static.wixstatic.com/media/cms-swedish.jpg',
  });
});

test('featured grid prefers the collection image over researched imagery', () => {
  const treatment = toCardTreatment({
    id: 'service-id',
    name: 'Swedish massage',
    slug: 'swedish-massage',
    categoryName: 'Massage',
    durationMinutes: 60,
    priceCents: 8000,
    imageUrl: 'https://static.wixstatic.com/media/cms-swedish.jpg',
  });
  const featured = resolveFeatured(treatment ? [treatment] : [], [
    'swedish-massage',
  ]);
  expect(featured[0]?.image).toBe(
    'https://static.wixstatic.com/media/cms-swedish.jpg',
  );
});
