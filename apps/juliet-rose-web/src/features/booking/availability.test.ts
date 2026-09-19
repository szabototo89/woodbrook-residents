import { expect, test } from 'vitest';

import {
  createDailySlots,
  formatBookingDate,
  isBookableDate,
} from './availability';

test('booking availability accepts future weekdays and rejects past dates and weekends', () => {
  const today = new Date(2026, 8, 19);

  expect(isBookableDate(new Date(2026, 8, 21), today)).toBe(true);
  expect(isBookableDate(new Date(2026, 8, 20), today)).toBe(false);
  expect(isBookableDate(new Date(2026, 8, 18), today)).toBe(false);
});

test('booking availability creates appointment starts within the published opening hours', () => {
  expect(createDailySlots(90)).toEqual([
    '10:00',
    '11:30',
    '13:00',
    '14:30',
    '16:00',
    '17:30',
  ]);
  expect(createDailySlots(60).at(-1)).toBe('19:00');
});

test('booking availability formats the selected date for people in Ireland', () => {
  expect(formatBookingDate(new Date(2026, 8, 21))).toBe(
    'Monday, 21 September 2026',
  );
});
