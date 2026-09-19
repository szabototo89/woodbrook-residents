import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from 'vitest';

const appRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const readSource = (relativePath: string) =>
  readFileSync(join(appRoot, relativePath), 'utf8');

const BOOKING_SELECTORS = [
  '.booking-page',
  '.booking-flow',
  '.booking-journey',
  '.customer-form',
  '.time-grid',
  '.booking-calendar',
];

const TREATMENT_SELECTORS = [
  '.treatment-page',
  '.treatment-catalog',
  '.treatment-guidance',
];

test('global styles stay free of booking and treatment page rules', () => {
  const globalStyles = readSource('styles.css');

  for (const selector of [
    ...BOOKING_SELECTORS,
    ...TREATMENT_SELECTORS,
    '.editorial-page-hero',
  ]) {
    expect(globalStyles).not.toContain(selector);
  }
});

test('booking page styles ship with the booking route', () => {
  const bookingStyles = readSource('features/booking/booking.css');

  for (const selector of BOOKING_SELECTORS) {
    expect(bookingStyles).toContain(selector);
  }
  expect(bookingStyles).not.toContain('.treatment-catalog');
});

test('treatment page styles ship with the treatments route', () => {
  const treatmentStyles = readSource('features/treatments/treatments.css');

  for (const selector of TREATMENT_SELECTORS) {
    expect(treatmentStyles).toContain(selector);
  }
  expect(treatmentStyles).not.toContain('.customer-form');
});

test('shared editorial hero styles ship with the editorial hero', () => {
  const editorialStyles = readSource('components/EditorialPageHero.css');

  expect(editorialStyles).toContain('.editorial-page-hero');
});
