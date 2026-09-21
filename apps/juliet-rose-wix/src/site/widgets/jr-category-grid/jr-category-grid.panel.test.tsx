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
import JrCategoryGridPanel from './jr-category-grid.panel';

const getProp = vi.mocked(widget.getProp);
const setProp = vi.mocked(widget.setProp);

function fieldValue(view: { container: HTMLElement }, key: string) {
  const field = view.container.querySelector<HTMLInputElement>(
    `[data-hook="jr-category-grid-panel-${key}"] input`,
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

test('jr-category-grid panel loads stored widget properties into its fields', async () => {
  getProp.mockImplementation(async (key: string) =>
    key === 'view-all-href' ? '/custom-treatments' : '',
  );
  const view = renderUi(<JrCategoryGridPanel />);
  await act(async () => {
    await Promise.resolve();
  });

  expect(getProp).toHaveBeenCalledWith('view-all-label');
  expect(getProp).toHaveBeenCalledWith('view-all-href');
  expect(fieldValue(view, 'view-all-href').value).toBe('/custom-treatments');
  view.unmount();
});

test('jr-category-grid panel writes field edits back to the widget property', async () => {
  getProp.mockImplementation(async () => '');
  setProp.mockResolvedValue(undefined);
  const view = renderUi(<JrCategoryGridPanel />);
  await act(async () => {
    await Promise.resolve();
  });

  const field = fieldValue(view, 'view-all-label');
  const nativeSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set;
  await act(async () => {
    nativeSetter?.call(field, 'See everything');
    field.dispatchEvent(new Event('input', { bubbles: true }));
  });

  expect(setProp).toHaveBeenCalledWith('view-all-label', 'See everything');
  expect(field.value).toBe('See everything');
  view.unmount();
});
