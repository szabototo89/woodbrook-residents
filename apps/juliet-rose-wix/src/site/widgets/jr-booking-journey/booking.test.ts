import { expect, test } from 'vitest';

import {
  MOCK_SERVICES,
  MOCK_SLOTS,
  formatBookingDate,
  isBookableDateString,
  toDateString,
  toTimeSlotLabel,
  validateCustomer,
} from './booking';

test('formats a local date string without timezone shifts', () => {
  expect(toDateString(new Date(2026, 8, 21, 23, 30))).toBe('2026-09-21');
});

test('treats weekdays from today as bookable', () => {
  expect(isBookableDateString('2026-09-21', '2026-09-19')).toBe(true);
  expect(isBookableDateString('2026-09-21', '2026-09-21')).toBe(true);
});

test('rejects weekends and past dates', () => {
  expect(isBookableDateString('2026-09-20', '2026-09-19')).toBe(false);
  expect(isBookableDateString('2026-09-18', '2026-09-19')).toBe(false);
});

test('formats the booking date like the original journey', () => {
  expect(formatBookingDate('2026-09-21')).toBe('Monday, 21 September 2026');
});

test('labels slots with their local start time', () => {
  expect(toTimeSlotLabel('2026-09-21T14:30:00')).toBe('14:30');
});

test('accepts a complete customer record', () => {
  expect(
    validateCustomer({
      name: 'Diana Prince',
      email: 'diana@example.com',
      phone: '0851234567',
      notes: '',
    }),
  ).toEqual({});
});

test('rejects a blank name, a bad email, and a short phone number', () => {
  expect(
    validateCustomer({
      name: '  ',
      email: 'diana@example.com',
      phone: '0851234567',
      notes: '',
    }),
  ).toEqual({ name: 'Enter your name' });
  expect(
    validateCustomer({
      name: 'Diana',
      email: 'not-an-email',
      phone: '0851234567',
      notes: '',
    }),
  ).toEqual({ email: 'Enter a valid email address' });
  expect(
    validateCustomer({
      name: 'Diana',
      email: 'diana@example.com',
      phone: '123',
      notes: '',
    }),
  ).toEqual({ phone: 'Enter a phone number' });
});

test('editor mocks cover services and daily slots without backend calls', () => {
  expect(MOCK_SERVICES.length).toBeGreaterThan(0);
  expect(MOCK_SERVICES[0]?.slug).toBe('swedish-massage');
  expect(MOCK_SLOTS('2026-09-21').map((slot) => slot.label)).toEqual([
    '10:00',
    '11:30',
    '14:00',
    '16:30',
  ]);
});
