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
import JrBookingPolicyPanel from './jr-booking-policy.panel';

const getProp = vi.mocked(widget.getProp);
const setProp = vi.mocked(widget.setProp);

function fieldValue(view: { container: HTMLElement }, key: string) {
  const field = view.container.querySelector<HTMLInputElement>(
    `[data-hook="jr-booking-policy-panel-${key}"] input`,
  );
  if (!field) {
    throw new Error(`Expected a panel field for "${key}"`);
  }
  return field;
}

function editField(field: HTMLInputElement, value: string) {
  const nativeSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set;
  nativeSetter?.call(field, value);
  field.dispatchEvent(new Event('input', { bubbles: true }));
}

beforeEach(() => {
  setProp.mockClear();
  getProp.mockReset();
});

test('jr-booking-policy panel loads stored widget properties into its fields', async () => {
  getProp.mockImplementation(async (key: string) =>
    key === 'title' ? 'Stored policy title' : '',
  );
  const view = renderUi(<JrBookingPolicyPanel />);
  await act(async () => {
    await Promise.resolve();
  });

  expect(getProp).toHaveBeenCalledWith('title');
  expect(getProp).toHaveBeenCalledWith('full-url');
  expect(fieldValue(view, 'title').value).toBe('Stored policy title');
  view.unmount();
});

test('jr-booking-policy panel writes field edits back to the widget property', async () => {
  getProp.mockImplementation(async () => '');
  setProp.mockResolvedValue(undefined);
  const view = renderUi(<JrBookingPolicyPanel />);
  await act(async () => {
    await Promise.resolve();
  });

  const field = fieldValue(view, 'full-label');
  await act(async () => {
    editField(field, 'Custom label');
    await Promise.resolve();
  });

  expect(setProp).toHaveBeenCalledWith('full-label', 'Custom label');
  expect(field.value).toBe('Custom label');
  view.unmount();
});
