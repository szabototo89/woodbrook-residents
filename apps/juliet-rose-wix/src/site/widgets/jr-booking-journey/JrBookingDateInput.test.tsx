import { act } from 'react';
import { expect, test, vi } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';
import { JrBookingDateInput } from './JrBookingDateInput';

test('jr-booking-date-input constrains the range to six months', () => {
  const view = renderUi(
    <JrBookingDateInput
      min="2026-09-19"
      max="2027-03-19"
      onSelect={() => {}}
    />,
  );

  const input = view.container.querySelector('input[type="date"]')!;
  expect(input.getAttribute('min')).toBe('2026-09-19');
  expect(input.getAttribute('max')).toBe('2027-03-19');
  view.unmount();
});

test('jr-booking-date-input reports a chosen weekday', async () => {
  const onSelect = vi.fn();
  const view = renderUi(
    <JrBookingDateInput
      min="2026-09-19"
      max="2027-03-19"
      onSelect={onSelect}
    />,
  );

  await act(async () => {
    const input = view.container.querySelector('input[type="date"]')!;
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )?.set;
    setter?.call(input, '2026-09-21');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await Promise.resolve();
  });

  expect(onSelect).toHaveBeenCalledWith('2026-09-21');
  view.unmount();
});

test('jr-booking-date-input rejects weekends with guidance', async () => {
  const onSelect = vi.fn();
  const view = renderUi(
    <JrBookingDateInput
      min="2026-09-19"
      max="2027-03-19"
      onSelect={onSelect}
    />,
  );

  await act(async () => {
    const input = view.container.querySelector('input[type="date"]')!;
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )?.set;
    setter?.call(input, '2026-09-20');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await Promise.resolve();
  });

  expect(onSelect).toHaveBeenCalledWith(undefined);
  expect(view.container.textContent).toContain(
    'Appointments are Monday to Friday.',
  );
  view.unmount();
});
