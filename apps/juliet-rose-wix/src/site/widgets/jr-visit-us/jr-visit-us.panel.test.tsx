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
import JrVisitUsPanel from './jr-visit-us.panel';

const getProp = vi.mocked(widget.getProp);
const setProp = vi.mocked(widget.setProp);

function fieldValue(view: { container: HTMLElement }, key: string) {
  const field = view.container.querySelector<HTMLInputElement>(
    `[data-hook="jr-visit-us-panel-${key}"] input`,
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

test('jr-visit-us panel loads stored widget properties into its fields', async () => {
  getProp.mockImplementation(async (key: string) =>
    key === 'phone-label' ? 'Stored phone' : '',
  );
  const view = renderUi(<JrVisitUsPanel />);
  await act(async () => {
    await Promise.resolve();
  });

  expect(getProp).toHaveBeenCalledWith('phone-label');
  expect(getProp).toHaveBeenCalledWith('address');
  expect(fieldValue(view, 'phone-label').value).toBe('Stored phone');
  view.unmount();
});

test('jr-visit-us panel writes field edits back to the widget property', async () => {
  getProp.mockImplementation(async () => '');
  setProp.mockResolvedValue(undefined);
  const view = renderUi(<JrVisitUsPanel />);
  await act(async () => {
    await Promise.resolve();
  });

  const field = fieldValue(view, 'address');
  await act(async () => {
    editField(field, 'Custom address');
    await Promise.resolve();
  });

  expect(setProp).toHaveBeenCalledWith('address', 'Custom address');
  expect(field.value).toBe('Custom address');
  view.unmount();
});
