// @vitest-environment happy-dom

import { expect, test, vi } from 'vitest';

import { click, renderUi } from '../../test-utils/renderUi';
import { AppointmentDatePicker } from './AppointmentDatePicker';

test('lets a customer choose an available weekday', () => {
  const onSelect = vi.fn();
  const view = renderUi(
    <AppointmentDatePicker
      onSelect={onSelect}
      selected={undefined}
      today={new Date(2026, 8, 19)}
    />,
  );

  const monday = view.container.querySelector<HTMLButtonElement>(
    '[data-day="2026-09-21"] button',
  );
  expect(monday).not.toBeNull();
  click(monday!);
  expect(onSelect).toHaveBeenCalledWith(new Date(2026, 8, 21));

  const sunday = view.container.querySelector<HTMLButtonElement>(
    '[data-day="2026-09-20"] button',
  );
  expect(sunday?.disabled).toBe(true);
  view.unmount();
});

test('defaults the calendar month to today when no date is given', () => {
  const view = renderUi(
    <AppointmentDatePicker onSelect={() => undefined} selected={undefined} />,
  );

  expect(view.container.querySelector('.booking-calendar')).not.toBeNull();
  view.unmount();
});
