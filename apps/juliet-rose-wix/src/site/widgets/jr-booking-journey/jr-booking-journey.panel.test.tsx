import { act } from 'react';
import { beforeEach, expect, test, vi } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';

vi.mock('@wix/editor', () => ({
  widget: {
    getProp: vi.fn(),
    setProp: vi.fn(),
  },
}));

import { widget } from '@wix/editor';
import JrBookingJourneyPanel from './jr-booking-journey.panel';

const getProp = vi.mocked(widget.getProp);
const setProp = vi.mocked(widget.setProp);

function fieldValue(view: { container: HTMLElement }, key: string) {
  const field = view.container.querySelector<HTMLInputElement>(
    `[data-hook="jr-booking-journey-panel-${key}"] input`,
  );
  if (!field) {
    throw new Error(`Expected a panel field for "${key}"`);
  }
  return field;
}

beforeEach(() => {
  setProp.mockClear();
  getProp.mockReset();
});

test('jr-booking-journey panel loads stored widget properties into its fields', async () => {
  getProp.mockImplementation(async (key: string) =>
    key === 'initial-service' ? 'swedish-massage' : '',
  );
  const view = renderUi(<JrBookingJourneyPanel />);
  await act(async () => {
    await Promise.resolve();
  });

  expect(getProp).toHaveBeenCalledWith('initial-service');
  expect(getProp).toHaveBeenCalledWith('today');
  expect(fieldValue(view, 'initial-service').value).toBe('swedish-massage');
  view.unmount();
});

test('jr-booking-journey panel writes field edits back to the widget property', async () => {
  getProp.mockImplementation(async () => '');
  setProp.mockResolvedValue(undefined);
  const view = renderUi(<JrBookingJourneyPanel />);
  await act(async () => {
    await Promise.resolve();
  });

  const field = fieldValue(view, 'initial-service');
  const nativeSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set;
  await act(async () => {
    nativeSetter?.call(field, 'microneedling');
    field.dispatchEvent(new Event('input', { bubbles: true }));
  });

  expect(setProp).toHaveBeenCalledWith('initial-service', 'microneedling');
  expect(field.value).toBe('microneedling');
  view.unmount();
});
