import { expect, test } from 'vitest';
import { enquiryMailto } from './enquiryMailto';

test('prepares an encoded email with the visitor’s complete enquiry', () => {
  const url = enquiryMailto(
    { email: 'artist@example.com', mailtoSubject: 'Art & colour enquiry' },
    {
      name: '  Sarah Murphy  ',
      email: 'sarah@example.com',
      phone: '089 123 4567',
      service: 'Murals (Indoor & Outdoor)',
      message: 'A pink & blue mural?\nFor our café in Dublin.',
    },
  );
  expect(url.startsWith('mailto:artist@example.com?')).toBe(true);
  const query = new URLSearchParams(url.split('?')[1]);
  expect(query.get('subject')).toBe(
    'Art & colour enquiry — Murals (Indoor & Outdoor)',
  );
  expect(query.get('body')).toBe(
    'Name: Sarah Murphy\nEmail: sarah@example.com\nPhone: 089 123 4567\nService: Murals (Indoor & Outdoor)\n\nA pink & blue mural?\nFor our café in Dublin.',
  );
});

test('omits optional phone details when none are provided', () => {
  const url = enquiryMailto(
    { email: 'artist@example.com', mailtoSubject: 'Enquiry' },
    {
      name: 'Jo',
      email: 'jo@example.com',
      phone: ' ',
      service: 'Other / not sure yet',
      message: 'A gift.',
    },
  );
  expect(new URLSearchParams(url.split('?')[1]).get('body')).not.toContain(
    'Phone:',
  );
});
