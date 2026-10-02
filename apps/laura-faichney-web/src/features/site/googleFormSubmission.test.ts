import { expect, test } from 'vitest';
import {
  googleFormFields,
  googleFormSubmissionUrl,
} from './googleFormSubmission';

test('maps the complete enquiry to the verified Google Form fields', () => {
  expect(googleFormSubmissionUrl).toBe(
    'https://docs.google.com/forms/d/e/1FAIpQLSdzi1qQfNPhVfYByQIrMl4_bv_nogGTDtO_9iYfjfFo7kRtyg/formResponse?hl=en',
  );
  expect(
    googleFormFields({
      name: '  Sarah Murphy  ',
      email: ' sarah@example.com ',
      phone: '089 123 4567',
      service: 'Murals (Indoor & Outdoor)',
      message: 'A pink & blue mural?\nFor our café.',
    }),
  ).toEqual({
    'entry.1440085785': 'Sarah Murphy',
    'entry.2023704522': 'sarah@example.com',
    'entry.1459025164': '089 123 4567',
    'entry.829351925': 'Murals (Indoor & Outdoor)',
    'entry.992508615': 'A pink & blue mural?\nFor our café.',
  });
});

test('retains a blank optional phone without inventing contact details', () => {
  expect(
    googleFormFields({
      name: 'Jo',
      email: 'jo@example.com',
      phone: ' ',
      service: 'Other / not sure yet',
      message: 'A gift.',
    })['entry.1459025164'],
  ).toBe('');
});
