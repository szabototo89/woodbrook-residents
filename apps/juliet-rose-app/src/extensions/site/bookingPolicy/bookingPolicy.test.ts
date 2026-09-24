import { expect, test } from 'vitest';

import {
  BOOKING_POLICY_COLLECTION_ID,
  BOOKING_POLICY_DEFAULTS,
} from './bookingPolicy';
import { queryBookingPolicy } from './bookingPolicyServices';

test('booking policy uses the BookingPolicy collection', () => {
  expect(BOOKING_POLICY_COLLECTION_ID).toBe('BookingPolicy');
});

test('booking policy defaults match the current policy copy', () => {
  expect(BOOKING_POLICY_DEFAULTS.title).toBe('Booking policy');
  expect(BOOKING_POLICY_DEFAULTS.fullUrl).toBe(
    'https://www.julietrosebeauty.com/',
  );
});

test('queryBookingPolicy returns an empty object when fetch fails', async () => {
  const result = await queryBookingPolicy(async () => {
    throw new Error('boom');
  });
  expect(result).toEqual({});
});

test('queryBookingPolicy returns fetched item data', async () => {
  const result = await queryBookingPolicy(async () => ({
    title: 'Custom policy',
  }));
  expect(result.title).toBe('Custom policy');
});
