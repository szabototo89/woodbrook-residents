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
import JrSiteFooterPanel from './jr-site-footer.panel';

const getProp = vi.mocked(widget.getProp);
const setProp = vi.mocked(widget.setProp);

function fieldValue(view: { container: HTMLElement }, key: string) {
  const field = view.container.querySelector<HTMLInputElement>(
    `[data-hook="jr-site-footer-panel-${key}"] input`,
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

test('jr-site-footer panel loads stored widget properties into its fields', async () => {
  getProp.mockImplementation(async (key: string) =>
    key === 'tagline' ? 'Stored tagline' : '',
  );
  const view = renderUi(<JrSiteFooterPanel />);
  await act(async () => {
    await Promise.resolve();
  });

  expect(getProp).toHaveBeenCalledWith('tagline');
  expect(getProp).toHaveBeenCalledWith('instagram-url');
  expect(fieldValue(view, 'tagline').value).toBe('Stored tagline');
  view.unmount();
});

test('jr-site-footer panel writes field edits back to the widget property', async () => {
  getProp.mockImplementation(async () => '');
  setProp.mockResolvedValue(undefined);
  const view = renderUi(<JrSiteFooterPanel />);
  await act(async () => {
    await Promise.resolve();
  });

  const field = fieldValue(view, 'instagram-url');
  await act(async () => {
    editField(field, 'https://example.com/studio');
    await Promise.resolve();
  });

  expect(setProp).toHaveBeenCalledWith(
    'instagram-url',
    'https://example.com/studio',
  );
  expect(field.value).toBe('https://example.com/studio');
  view.unmount();
});
