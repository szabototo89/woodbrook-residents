import { expect, test } from 'vitest';
import { normalizeAccountDetails } from './accountDetails';

test('location fields are optional and trim incidental whitespace', () => {
  expect(normalizeAccountDetails({ eircode: '', address: '  ' })).toEqual({
    eircode: '',
    address: '',
  });
  expect(
    normalizeAccountDetails({
      eircode: ' a65f4e2 ',
      address: ' Sample address\nSample town ',
    }),
  ).toEqual({ eircode: 'A65 F4E2', address: 'Sample address\nSample town' });
  expect(
    normalizeAccountDetails({ eircode: 'd6w ab12', address: '' }).eircode,
  ).toBe('D6W AB12');
});

test('invalid Eircode shape and excessive address length are rejected without echoing private data', () => {
  expect(() =>
    normalizeAccountDetails({ eircode: 'INVALID', address: '' }),
  ).toThrow('Enter an Eircode in the format A65 F4E2.');
  expect(() =>
    normalizeAccountDetails({ eircode: '', address: 'a'.repeat(501) }),
  ).toThrow('Keep the address to 500 characters or fewer.');
});
