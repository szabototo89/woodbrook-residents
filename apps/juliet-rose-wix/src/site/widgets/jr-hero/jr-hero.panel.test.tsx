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
import HeroPanel from './jr-hero.panel';

const getProp = vi.mocked(widget.getProp);
const setProp = vi.mocked(widget.setProp);

const STORED: Readonly<Record<string, string>> = {
  eyebrow: 'Stored eyebrow',
  title: 'Stored title',
};

function fieldValue(view: { container: HTMLElement }, key: string) {
  const field = view.container.querySelector<HTMLInputElement>(
    `[data-hook="jr-hero-panel-${key}"] input`,
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

test('jr-hero panel loads stored widget properties into its fields', async () => {
  getProp.mockImplementation(async (key: string) => STORED[key] ?? '');
  const view = renderUi(<HeroPanel />);
  await act(async () => {
    await Promise.resolve();
  });

  expect(getProp).toHaveBeenCalledWith('eyebrow');
  expect(getProp).toHaveBeenCalledWith('title');
  expect(fieldValue(view, 'eyebrow').value).toBe('Stored eyebrow');
  expect(fieldValue(view, 'title').value).toBe('Stored title');
  view.unmount();
});

test('jr-hero panel writes field edits back to the widget property', async () => {
  getProp.mockImplementation(async () => '');
  setProp.mockResolvedValue(undefined);
  const view = renderUi(<HeroPanel />);
  await act(async () => {
    await Promise.resolve();
  });

  const field = fieldValue(view, 'title');
  const nativeSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set;
  await act(async () => {
    nativeSetter?.call(field, 'New title');
    field.dispatchEvent(new Event('input', { bubbles: true }));
  });

  expect(setProp).toHaveBeenCalledWith('title', 'New title');
  expect(field.value).toBe('New title');
  view.unmount();
});
