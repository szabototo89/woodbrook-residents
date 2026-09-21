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
import StudioSectionsPanel from './jr-studio-sections.panel';

const getProp = vi.mocked(widget.getProp);
const setProp = vi.mocked(widget.setProp);

const STORED: Readonly<Record<string, string>> = {
  'gift-title': 'Stored gift title',
  'phone-label': 'Stored phone label',
};

function fieldValue(view: { container: HTMLElement }, key: string) {
  const field = view.container.querySelector<HTMLInputElement>(
    `[data-hook="jr-studio-sections-panel-${key}"] input`,
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

test('jr-studio-sections panel loads stored widget properties into its fields', async () => {
  getProp.mockImplementation(async (key: string) => STORED[key] ?? '');
  const view = renderUi(<StudioSectionsPanel />);
  await act(async () => {
    await Promise.resolve();
  });

  expect(getProp).toHaveBeenCalledWith('gift-title');
  expect(getProp).toHaveBeenCalledWith('phone-label');
  expect(fieldValue(view, 'gift-title').value).toBe('Stored gift title');
  expect(fieldValue(view, 'phone-label').value).toBe('Stored phone label');
  view.unmount();
});

test('jr-studio-sections panel writes field edits back to the widget property', async () => {
  getProp.mockImplementation(async () => '');
  setProp.mockResolvedValue(undefined);
  const view = renderUi(<StudioSectionsPanel />);
  await act(async () => {
    await Promise.resolve();
  });

  const field = fieldValue(view, 'gift-title');
  const nativeSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set;
  await act(async () => {
    nativeSetter?.call(field, 'New gift title');
    field.dispatchEvent(new Event('input', { bubbles: true }));
  });

  expect(setProp).toHaveBeenCalledWith('gift-title', 'New gift title');
  expect(field.value).toBe('New gift title');
  view.unmount();
});
