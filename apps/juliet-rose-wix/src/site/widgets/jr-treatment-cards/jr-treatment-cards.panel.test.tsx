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
import TreatmentCardsPanel from './jr-treatment-cards.panel';

const getProp = vi.mocked(widget.getProp);
const setProp = vi.mocked(widget.setProp);

function fieldValue(view: { container: HTMLElement }, key: string) {
  const field = view.container.querySelector<HTMLInputElement>(
    `[data-hook="jr-treatment-cards-panel-${key}"] input`,
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

test('jr-treatment-cards panel loads stored widget properties into its fields', async () => {
  getProp.mockImplementation(async (key: string) =>
    key === 'display' ? 'catalog' : '',
  );
  const view = renderUi(<TreatmentCardsPanel />);
  await act(async () => {
    await Promise.resolve();
  });

  expect(getProp).toHaveBeenCalledWith('display');
  expect(getProp).toHaveBeenCalledWith('featured-slugs');
  expect(fieldValue(view, 'display').value).toBe('catalog');
  view.unmount();
});

test('jr-treatment-cards panel writes field edits back to the widget property', async () => {
  getProp.mockImplementation(async () => '');
  setProp.mockResolvedValue(undefined);
  const view = renderUi(<TreatmentCardsPanel />);
  await act(async () => {
    await Promise.resolve();
  });

  const field = fieldValue(view, 'featured-slugs');
  const nativeSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set;
  await act(async () => {
    nativeSetter?.call(field, 'swedish-massage');
    field.dispatchEvent(new Event('input', { bubbles: true }));
  });

  expect(setProp).toHaveBeenCalledWith('featured-slugs', 'swedish-massage');
  expect(field.value).toBe('swedish-massage');
  view.unmount();
});
