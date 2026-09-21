import { act } from 'react';
import { expect, test, vi } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';
import { JrBookingJourney } from './JrBookingJourney';

function setInputValue(field: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set;
  setter?.call(field, value);
  field.dispatchEvent(new Event('input', { bubbles: true }));
}

function setSelectValue(field: HTMLSelectElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLSelectElement.prototype,
    'value',
  )?.set;
  setter?.call(field, value);
  field.dispatchEvent(new Event('change', { bubbles: true }));
}

test('jr-booking-journey renders the hero, steps, and mock services without fetching', async () => {
  const listServices = vi.fn(async () => []);
  const view = renderUi(
    <JrBookingJourney
      viewMode="Editor"
      today="2026-09-19"
      listServices={listServices}
    />,
  );
  await act(async () => {
    await Promise.resolve();
  });

  expect(listServices).not.toHaveBeenCalled();
  expect(view.container.textContent).toContain('Request an');
  expect(view.container.textContent).toContain('Choose a treatment');
  expect(view.container.textContent).toContain('Choose a date');
  expect(view.container.textContent).toContain('Choose a preferred time');
  expect(view.container.textContent).toContain('Your details');
  expect(
    view.container.querySelector('option[value="swedish-massage"]')
      ?.textContent,
  ).toContain('Swedish massage');
  view.unmount();
});

test('jr-booking-journey completes a mock booking from treatment to confirmation', async () => {
  const view = renderUi(
    <JrBookingJourney viewMode="Editor" today="2026-09-19" />,
  );
  await act(async () => {
    await Promise.resolve();
  });

  await act(async () => {
    setSelectValue(view.container.querySelector('select')!, 'swedish-massage');
    await Promise.resolve();
  });
  expect(view.container.textContent).toContain('60 minutes · €80');

  await act(async () => {
    setInputValue(
      view.container.querySelector('input[type="date"]')!,
      '2026-09-21',
    );
    await Promise.resolve();
  });
  expect(view.container.textContent).toContain(
    'Available times for Monday, 21 September 2026.',
  );

  await act(async () => {
    view.container
      .querySelector('input[value="2026-09-21T14:00:00"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await Promise.resolve();
  });

  await act(async () => {
    setInputValue(view.container.querySelector('input[name="name"]')!, 'Diana');
    setInputValue(
      view.container.querySelector('input[name="email"]')!,
      'diana@example.com',
    );
    setInputValue(
      view.container.querySelector('input[name="phone"]')!,
      '0851234567',
    );
    await Promise.resolve();
  });

  await act(async () => {
    view.container
      .querySelector('button[type="submit"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await Promise.resolve();
  });

  expect(view.container.querySelector('[role="status"]')).not.toBeNull();
  expect(view.container.textContent).toContain('Thank you');
  expect(view.container.textContent).toContain('PREVIEW-0000');
  expect(view.container.textContent).toContain('Swedish massage');
  view.unmount();
});

test('jr-booking-journey resets the date and time when the treatment changes', async () => {
  const view = renderUi(
    <JrBookingJourney viewMode="Editor" today="2026-09-19" />,
  );
  await act(async () => {
    await Promise.resolve();
  });

  await act(async () => {
    setSelectValue(view.container.querySelector('select')!, 'swedish-massage');
    await Promise.resolve();
  });
  await act(async () => {
    setInputValue(
      view.container.querySelector('input[type="date"]')!,
      '2026-09-21',
    );
    await Promise.resolve();
  });
  expect(view.container.textContent).toContain('Available times for');

  await act(async () => {
    setSelectValue(
      view.container.querySelector('select')!,
      'juliet-rose-signature-facial',
    );
    await Promise.resolve();
  });

  expect(view.container.textContent).not.toContain('Available times for');
  expect(view.container.textContent).toContain(
    'Choose a date to see preferred times.',
  );
  view.unmount();
});

test('jr-booking-journey rejects weekend dates without loading slots', async () => {
  const listSlots = vi.fn(async () => []);
  const view = renderUi(
    <JrBookingJourney
      viewMode="Editor"
      today="2026-09-19"
      listSlots={listSlots}
    />,
  );
  await act(async () => {
    await Promise.resolve();
  });

  await act(async () => {
    setInputValue(
      view.container.querySelector('input[type="date"]')!,
      '2026-09-20',
    );
    await Promise.resolve();
  });

  expect(listSlots).not.toHaveBeenCalled();
  expect(view.container.textContent).toContain(
    'Appointments are Monday to Friday.',
  );
  view.unmount();
});

test('jr-booking-journey lists live services on the live site', async () => {
  const listServices = vi.fn(async () => [
    {
      id: 'live-id',
      slug: 'swedish-massage',
      name: 'Swedish massage',
      durationMinutes: 60,
      priceCents: 8000,
    },
  ]);
  const view = renderUi(
    <JrBookingJourney
      viewMode="Site"
      today="2026-09-19"
      listServices={listServices}
    />,
  );
  await act(async () => {
    await Promise.resolve();
  });

  expect(listServices).toHaveBeenCalledTimes(1);
  expect(
    view.container.querySelector('option[value="swedish-massage"]'),
  ).not.toBeNull();
  view.unmount();
});

test('jr-booking-journey preselects the service from its initial slug', async () => {
  const view = renderUi(
    <JrBookingJourney
      viewMode="Editor"
      today="2026-09-19"
      initialService="microneedling"
    />,
  );
  await act(async () => {
    await Promise.resolve();
  });

  expect(view.container.querySelector<HTMLSelectElement>('select')?.value).toBe(
    'microneedling',
  );
  expect(view.container.textContent).toContain('60 minutes · €130');
  view.unmount();
});
