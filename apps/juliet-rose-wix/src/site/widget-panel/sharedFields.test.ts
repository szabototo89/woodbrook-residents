import { expect, test } from 'vitest';

import {
  bookingLinkField,
  contactField,
  describeFieldKeys,
  imageField,
  viewAllFields,
} from './sharedFields';

test('booking link fields share one label and key vocabulary', () => {
  const booking = bookingLinkField('booking-base-url');
  const treatments = bookingLinkField('treatments-url');
  expect(booking.key).toBe('booking-base-url');
  expect(treatments.key).toBe('treatments-url');
  expect(booking.label).toMatch(/Booking/);
  expect(treatments.help ?? '').not.toBe('');
});

test('contact fields reuse phone/email labels with format help', () => {
  const phone = contactField('phone-href');
  const email = contactField('email-href');
  expect(phone.label).toBe(contactField('phone-href').label);
  expect(phone.help ?? '').toMatch(/tel:/);
  expect(email.help ?? '').toMatch(/mailto:/);
});

test('view-all and image fields expose stable keys for panels', () => {
  expect(describeFieldKeys(viewAllFields())).toEqual([
    'view-all-label',
    'view-all-href',
  ]);
  expect(imageField('studio-image-url').kind).toBe('url');
});
