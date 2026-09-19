// @vitest-environment happy-dom

import { act } from 'react';
import { expect, test, vi } from 'vitest';

import { renderUi } from '../../test-utils/renderUi';
import { createLocalBookingProvider } from './localBookingProvider';
import { BookingJourney } from './BookingJourney';

test('starts a booking with the selected treatment and clear next steps', () => {
  const view = renderUi(
    <BookingJourney
      initialTreatmentSlug="swedish-massage"
      provider={createLocalBookingProvider()}
      today={new Date(2026, 8, 19)}
    />,
  );

  expect(view.container.textContent).toContain('Request an appointment');
  expect(
    view.container.querySelector<HTMLOptionElement>(
      'option[value="swedish-massage"]',
    )?.selected,
  ).toBe(true);
  expect(view.container.textContent).toContain('Choose a date');
  expect(view.container.textContent).toContain('Your details');
  expect(view.container.textContent).toContain(
    'Please provide your contact information so we can confirm your appointment.',
  );
  expect(view.container.textContent).toContain('Professional & friendly care');
  expect(view.container.textContent).toContain('Relaxing environment');
  expect(view.container.textContent).toContain('Tailored to your needs');
  view.unmount();
});

test('describes available times for the selected date', async () => {
  const view = renderUi(
    <BookingJourney
      initialTreatmentSlug="swedish-massage"
      provider={createLocalBookingProvider()}
      today={new Date(2026, 8, 19)}
    />,
  );

  await act(async () => {
    view.container
      .querySelector<HTMLButtonElement>('[data-day="2026-09-21"] button')!
      .click();
    await Promise.resolve();
  });

  expect(view.container.textContent).toContain(
    'Available times for Monday, 21 September 2026.',
  );
  view.unmount();
});

test('completes an appointment request through the provider boundary', async () => {
  const provider = createLocalBookingProvider();
  const createBooking = vi.spyOn(provider, 'createBooking');
  const view = renderUi(
    <BookingJourney
      initialTreatmentSlug="swedish-massage"
      provider={provider}
      today={new Date(2026, 8, 19)}
    />,
  );

  await act(async () => {
    view.container
      .querySelector<HTMLButtonElement>('[data-day="2026-09-21"] button')!
      .click();
    await Promise.resolve();
  });

  const time = view.container.querySelector<HTMLInputElement>(
    'input[name="appointment-time"][value="10:00"]',
  )!;
  act(() => time.click());

  const details = {
    name: 'Aoife Murphy',
    email: 'aoife@example.com',
    phone: '085 123 4567',
  };
  for (const [name, value] of Object.entries(details)) {
    const input = view.container.querySelector<HTMLInputElement>(
      `[name="${name}"]`,
    )!;
    act(() => {
      Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value',
      )?.set?.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }

  await act(async () => {
    view.container
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });

  expect(createBooking).toHaveBeenCalledWith(
    expect.objectContaining({
      treatmentSlug: 'swedish-massage',
      date: '2026-09-21',
      time: '10:00',
      customer: expect.objectContaining(details),
    }),
  );
  expect(view.container.getAttribute('role')).not.toBe('status');
  expect(view.container.textContent).toContain('Request received');
  expect(view.container.textContent).toContain('Monday, 21 September 2026');
  view.unmount();
});

test('resets the booking choices when the treatment changes', async () => {
  const provider = createLocalBookingProvider();
  const view = renderUi(
    <BookingJourney provider={provider} today={new Date(2026, 8, 19)} />,
  );
  const select = view.container.querySelector('select')!;

  act(() => {
    select.value = 'microneedling';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  expect(view.container.textContent).toContain('60 minutes · €130');

  await act(async () => {
    view.container
      .querySelector<HTMLButtonElement>('[data-day="2026-09-21"] button')!
      .click();
    await Promise.resolve();
  });
  expect(
    view.container.querySelectorAll('[name="appointment-time"]'),
  ).toHaveLength(10);

  act(() => {
    select.value = 'back-massage';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  expect(
    view.container.querySelectorAll('[name="appointment-time"]'),
  ).toHaveLength(0);
  view.unmount();
});

test('ignores an unknown treatment passed in the URL', () => {
  const view = renderUi(
    <BookingJourney
      initialTreatmentSlug="unknown"
      provider={createLocalBookingProvider()}
      today={new Date(2026, 8, 19)}
    />,
  );

  expect(view.container.querySelector('select')?.value).toBe('');
  view.unmount();
});
