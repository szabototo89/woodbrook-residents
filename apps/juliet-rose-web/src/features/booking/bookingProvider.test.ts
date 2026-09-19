import { expect, test } from 'vitest';

import { createLocalBookingProvider } from './localBookingProvider';

test('local booking provider exposes available times without coupling the UI to a vendor', async () => {
  const provider = createLocalBookingProvider();

  await expect(
    provider.listAvailableTimes({
      treatmentSlug: 'swedish-massage',
      date: '2026-09-21',
    }),
  ).resolves.toEqual([
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
  ]);
});

test('local booking provider returns a provider-neutral confirmation after a valid request', async () => {
  const provider = createLocalBookingProvider();

  await expect(
    provider.createBooking({
      treatmentSlug: 'swedish-massage',
      date: '2026-09-21',
      time: '10:00',
      customer: {
        name: 'Aoife Murphy',
        email: 'aoife@example.com',
        phone: '085 123 4567',
      },
    }),
  ).resolves.toMatchObject({
    reference: expect.stringMatching(/^JR-/),
    status: 'requested',
  });
});

test('local booking provider rejects an unknown treatment', async () => {
  const provider = createLocalBookingProvider();

  await expect(
    provider.listAvailableTimes({
      treatmentSlug: 'unknown',
      date: '2026-09-21',
    }),
  ).rejects.toThrow('Treatment not found');
});
