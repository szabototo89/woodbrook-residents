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
import JrSiteHeaderPanel from './jr-site-header.panel';

const getProp = vi.mocked(widget.getProp);
const setProp = vi.mocked(widget.setProp);

function fieldValue(view: { container: HTMLElement }, key: string) {
  const field = view.container.querySelector<HTMLInputElement>(
    `[data-hook="jr-site-header-panel-${key}"] input`,
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

test('jr-site-header panel loads stored widget properties into its fields', async () => {
  getProp.mockImplementation(async (key: string) =>
    key === 'booking-label' ? 'Stored booking label' : '',
  );
  const view = renderUi(<JrSiteHeaderPanel />);
  await act(async () => {
    await Promise.resolve();
  });

  expect(getProp).toHaveBeenCalledWith('booking-label');
  expect(getProp).toHaveBeenCalledWith('booking-url');
  expect(fieldValue(view, 'booking-label').value).toBe('Stored booking label');
  view.unmount();
});

test('jr-site-header panel writes field edits back to the widget property', async () => {
  getProp.mockImplementation(async () => '');
  setProp.mockResolvedValue(undefined);
  const view = renderUi(<JrSiteHeaderPanel />);
  await act(async () => {
    await Promise.resolve();
  });

  const field = fieldValue(view, 'booking-url');
  await act(async () => {
    editField(field, '/custom-book');
    await Promise.resolve();
  });

  expect(setProp).toHaveBeenCalledWith('booking-url', '/custom-book');
  expect(field.value).toBe('/custom-book');
  view.unmount();
});
