import { expect, test } from 'vitest';

import {
  PREVIEW_TREATMENTS,
  bookTreatmentUrl,
  formatTreatmentDuration,
  formatTreatmentPrice,
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
