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
import JrGiftCardPanel from './jr-gift-card.panel';

const getProp = vi.mocked(widget.getProp);
const setProp = vi.mocked(widget.setProp);

function fieldValue(view: { container: HTMLElement }, key: string) {
  const field = view.container.querySelector<HTMLInputElement>(
    `[data-hook="jr-gift-card-panel-${key}"] input`,
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

test('jr-gift-card panel loads stored widget properties into its fields', async () => {
  getProp.mockImplementation(async (key: string) =>
    key === 'title' ? 'Stored gift title' : '',
  );
  const view = renderUi(<JrGiftCardPanel />);
  await act(async () => {
    await Promise.resolve();
  });

  expect(getProp).toHaveBeenCalledWith('title');
  expect(getProp).toHaveBeenCalledWith('card-url');
  expect(fieldValue(view, 'title').value).toBe('Stored gift title');
  view.unmount();
});

test('jr-gift-card panel writes field edits back to the widget property', async () => {
  getProp.mockImplementation(async () => '');
  setProp.mockResolvedValue(undefined);
  const view = renderUi(<JrGiftCardPanel />);
  await act(async () => {
    await Promise.resolve();
  });

  const field = fieldValue(view, 'card-url');
  await act(async () => {
    editField(field, 'https://example.com/gift');
    await Promise.resolve();
  });

  expect(setProp).toHaveBeenCalledWith('card-url', 'https://example.com/gift');
  expect(field.value).toBe('https://example.com/gift');
  view.unmount();
});
