import { expect, test, vi } from 'vitest';
import {
  googleFormFields,
  googleFormSubmissionUrl,
  sendGoogleFormEnquiry,
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

test('submits directly from the browser without navigation, credentials or a readable response', async () => {
  const send = vi.fn().mockResolvedValue({ type: 'opaque' });
  await sendGoogleFormEnquiry(
    {
      name: 'Jo',
      email: 'jo@example.com',
      phone: '',
      service: 'Other / not sure yet',
      message: 'A colourful gift.',
    },
    send,
  );
  expect(send).toHaveBeenCalledOnce();
  const [url, options] = send.mock.calls[0]!;
  expect(url).toBe(googleFormSubmissionUrl);
  expect(options).toMatchObject({
    method: 'POST',
    mode: 'no-cors',
    credentials: 'omit',
  });
  expect(options.body).toBeInstanceOf(URLSearchParams);
  expect(options.body.get('entry.992508615')).toBe('A colourful gift.');
});

test('propagates a network failure without automatically retrying', async () => {
  const send = vi.fn().mockRejectedValue(new Error('offline'));
  await expect(
    sendGoogleFormEnquiry(
      {
        name: 'Jo',
        email: 'jo@example.com',
        phone: '',
        service: 'Other / not sure yet',
        message: 'A gift.',
      },
      send,
    ),
  ).rejects.toThrow('offline');
  expect(send).toHaveBeenCalledOnce();
});
