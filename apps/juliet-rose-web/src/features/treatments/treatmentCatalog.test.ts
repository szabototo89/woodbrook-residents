import { expect, test } from 'vitest';

import {
  formatTreatmentDuration,
  getTreatmentBySlug,
  listTreatments,
  requireTreatmentBySlug,
  toTreatment,
  toTreatmentCategory,
} from './treatmentCatalog';

test('treatment catalog loads the current Juliet Rose services from the sourced catalog', () => {
  const treatments = listTreatments();

  expect(treatments).toHaveLength(24);
  expect(treatments[0]).toMatchObject({
    name: 'Luxurious Espa massage',
    durationMinutes: 90,
    priceCents: 10000,
    sourceUrl: 'https://www.julietrosebeauty.com/book-online',
    sourceAccessedAt: '2026-09-19',
  });
  expect(treatments.at(-1)).toMatchObject({
    name: 'Touch of Tranquility',
    durationMinutes: 90,
    priceCents: 10000,
  });
});

test('treatment catalog finds a treatment by its stable booking slug', () => {
  expect(getTreatmentBySlug('juliet-rose-signature-facial')).toMatchObject({
    name: 'Juliet Rose Signature Facial',
    category: 'Facials & skin',
  });
  expect(getTreatmentBySlug('not-a-treatment')).toBeUndefined();
});

test('treatment catalog requires known treatments and formats their duration', () => {
  expect(requireTreatmentBySlug('mini-facial').name).toBe('Mini facial');
  expect(() => requireTreatmentBySlug('unknown')).toThrow(
    'Treatment not found',
  );
  expect(formatTreatmentDuration(60)).toBe('1 hr');
  expect(formatTreatmentDuration(70)).toBe('1 hr 10 min');
  expect(formatTreatmentDuration(30)).toBe('30 min');
});

test('treatment catalog converts only its string-literal categories', () => {
  expect(toTreatmentCategory('Massage')).toBe('Massage');
  expect(() => toTreatmentCategory('Hair')).toThrow();
});

test('treatment catalog rejects incomplete records at the data boundary', () => {
  expect(() =>
    toTreatment({
      slug: 'invalid',
      name: 'Invalid treatment',
      category: 'Massage',
    }),
  ).toThrow();
});
