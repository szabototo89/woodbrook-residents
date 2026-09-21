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
import JrFeaturedGridPanel from './jr-featured-grid.panel';

const getProp = vi.mocked(widget.getProp);
const setProp = vi.mocked(widget.setProp);

function fieldValue(view: { container: HTMLElement }, key: string) {
  const field = view.container.querySelector<HTMLInputElement>(
    `[data-hook="jr-featured-grid-panel-${key}"] input`,
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

test('jr-featured-grid panel loads stored widget properties into its fields', async () => {
  getProp.mockImplementation(async (key: string) =>
    key === 'featured-slugs' ? 'swedish-massage' : '',
  );
  const view = renderUi(<JrFeaturedGridPanel />);
  await act(async () => {
    await Promise.resolve();
  });

  expect(getProp).toHaveBeenCalledWith('featured-slugs');
  expect(getProp).toHaveBeenCalledWith('booking-base-url');
  expect(fieldValue(view, 'featured-slugs').value).toBe('swedish-massage');
  view.unmount();
});

test('jr-featured-grid panel writes field edits back to the widget property', async () => {
  getProp.mockImplementation(async () => '');
  setProp.mockResolvedValue(undefined);
  const view = renderUi(<JrFeaturedGridPanel />);
  await act(async () => {
    await Promise.resolve();
  });

  const field = fieldValue(view, 'booking-base-url');
  await act(async () => {
    editField(field, '/custom-book');
    await Promise.resolve();
  });

  expect(setProp).toHaveBeenCalledWith('booking-base-url', '/custom-book');
  expect(field.value).toBe('/custom-book');
  view.unmount();
});
