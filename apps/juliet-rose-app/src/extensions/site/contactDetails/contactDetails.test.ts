import { expect, test } from 'vitest';

import {
  CONTACT_DETAILS_COLLECTION_ID,
  CONTACT_DETAILS_DEFAULTS,
} from './contactDetails';
import { queryContactDetails } from './contactDetailsServices';

test('contact details use the ContactDetails collection', () => {
  expect(CONTACT_DETAILS_COLLECTION_ID).toBe('ContactDetails');
});

test('contact details defaults match the studio contact points', () => {
  expect(CONTACT_DETAILS_DEFAULTS.phoneHref).toBe('tel:+353852867059');
  expect(CONTACT_DETAILS_DEFAULTS.emailHref).toBe('mailto:denizzza1@gmail.com');
});

test('queryContactDetails returns an empty object when fetch fails', async () => {
  const result = await queryContactDetails(async () => {
    throw new Error('boom');
  });
  expect(result).toEqual({});
});

test('queryContactDetails returns fetched item data', async () => {
  const result = await queryContactDetails(async () => ({
    phoneLabel: '0123456789',
  }));
  expect(result.phoneLabel).toBe('0123456789');
});
