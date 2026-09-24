import { expect, test } from 'vitest';

import {
  CONTACT_DETAILS_COLLECTION_ID,
  CONTACT_DETAILS_DEFAULTS,
  resolveContactPanelDefaults,
  toEmailHref,
  toPhoneHref,
} from './contactDetails';
import { queryContactDetails } from './contactDetailsServices';

test('contact details use the ContactDetails collection', () => {
  expect(CONTACT_DETAILS_COLLECTION_ID).toBe('ContactDetails');
});

test('contact details defaults hold plain values without link schemes', () => {
  expect(CONTACT_DETAILS_DEFAULTS.phone).toBe('+353852867059');
  expect(CONTACT_DETAILS_DEFAULTS.email).toBe('denizzza1@gmail.com');
});

test('toPhoneHref builds a tap-to-call link from a plain number', () => {
  expect(toPhoneHref('+353852867059')).toBe('tel:+353852867059');
  expect(toPhoneHref('085 286 7059')).toBe('tel:0852867059');
  expect(toPhoneHref('tel:+353852867059')).toBe('tel:+353852867059');
});

test('toEmailHref builds an email link from a plain address', () => {
  expect(toEmailHref('denizzza1@gmail.com')).toBe('mailto:denizzza1@gmail.com');
  expect(toEmailHref('mailto:denizzza1@gmail.com')).toBe(
    'mailto:denizzza1@gmail.com',
  );
});

test('queryContactDetails returns an empty object when fetch fails', async () => {
  const result = await queryContactDetails(async () => {
    throw new Error('boom');
  });
  expect(result).toEqual({});
});

test('queryContactDetails returns fetched item data', async () => {
  const result = await queryContactDetails(async () => ({
    phone: '+353852867059',
  }));
  expect(result.phone).toBe('+353852867059');
});

test('resolveContactPanelDefaults falls back to defaults when contact is empty', () => {
  expect(resolveContactPanelDefaults(undefined)).toEqual({
    'phone-href': toPhoneHref(CONTACT_DETAILS_DEFAULTS.phone),
    'phone-label': CONTACT_DETAILS_DEFAULTS.phone,
    'email-href': toEmailHref(CONTACT_DETAILS_DEFAULTS.email),
    'email-label': CONTACT_DETAILS_DEFAULTS.email,
  });
  expect(resolveContactPanelDefaults({})).toEqual(
    resolveContactPanelDefaults(undefined),
  );
});

test('resolveContactPanelDefaults formats collection values with href helpers', () => {
  expect(
    resolveContactPanelDefaults({
      phone: '085 286 7059',
      email: 'studio@example.com',
    }),
  ).toEqual({
    'phone-href': 'tel:0852867059',
    'phone-label': '085 286 7059',
    'email-href': 'mailto:studio@example.com',
    'email-label': 'studio@example.com',
  });
});

test('resolveContactPanelDefaults ignores blank collection values', () => {
  expect(resolveContactPanelDefaults({ phone: '  ', email: '' })).toEqual(
    resolveContactPanelDefaults(undefined),
  );
});
