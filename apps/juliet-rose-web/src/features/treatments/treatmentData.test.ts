import { expect, test } from 'vitest';

import {
  formatTreatmentDuration,
  getTreatmentBySlug,
  listTreatments,
  requireTreatmentBySlug,
} from './treatmentData';

test('treatment data loads without a runtime validator', () => {
  const treatments = listTreatments();

  expect(treatments).toHaveLength(24);
  expect(treatments[0]).toMatchObject({
    name: 'Luxurious Espa massage',
    durationMinutes: 90,
    priceCents: 10000,
  });
  expect(getTreatmentBySlug('juliet-rose-signature-facial')).toMatchObject({
    name: 'Juliet Rose Signature Facial',
  });
  expect(getTreatmentBySlug('not-a-treatment')).toBeUndefined();
  expect(requireTreatmentBySlug('mini-facial').name).toBe('Mini facial');
  expect(() => requireTreatmentBySlug('unknown')).toThrow(
    'Treatment not found',
  );
  expect(formatTreatmentDuration(60)).toBe('1 hr');
  expect(formatTreatmentDuration(70)).toBe('1 hr 10 min');
  expect(formatTreatmentDuration(30)).toBe('30 min');
});
