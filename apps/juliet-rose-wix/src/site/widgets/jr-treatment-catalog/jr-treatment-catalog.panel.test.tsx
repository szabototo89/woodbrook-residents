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
import JrTreatmentCatalogPanel from './jr-treatment-catalog.panel';

const getProp = vi.mocked(widget.getProp);
const setProp = vi.mocked(widget.setProp);

function fieldValue(view: { container: HTMLElement }) {
  const field = view.container.querySelector<HTMLInputElement>(
    '[data-hook="jr-treatment-catalog-panel-booking-base-url"] input',
  );
  if (!field) {
    throw new Error('Expected the booking base URL field');
  }
  return field;
}

beforeEach(() => {
  setProp.mockClear();
  getProp.mockReset();
});

test('jr-treatment-catalog panel loads the stored booking base URL', async () => {
  getProp.mockResolvedValue('/custom-book');
  const view = renderUi(<JrTreatmentCatalogPanel />);
  await act(async () => {
    await Promise.resolve();
  });

  expect(getProp).toHaveBeenCalledWith('booking-base-url');
  expect(fieldValue(view).value).toBe('/custom-book');
  view.unmount();
});

test('jr-treatment-catalog panel writes edits back to the widget property', async () => {
  getProp.mockResolvedValue('');
  setProp.mockResolvedValue(undefined);
  const view = renderUi(<JrTreatmentCatalogPanel />);
  await act(async () => {
    await Promise.resolve();
  });

  const field = fieldValue(view);
  const nativeSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set;
  await act(async () => {
    nativeSetter?.call(field, '/book-now');
    field.dispatchEvent(new Event('input', { bubbles: true }));
    await Promise.resolve();
  });

  expect(setProp).toHaveBeenCalledWith('booking-base-url', '/book-now');
  view.unmount();
});
