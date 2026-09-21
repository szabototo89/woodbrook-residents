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
import JrTreatmentGuidancePanel from './jr-treatment-guidance.panel';

const getProp = vi.mocked(widget.getProp);
const setProp = vi.mocked(widget.setProp);

function fieldValue(view: { container: HTMLElement }) {
  const field = view.container.querySelector<HTMLInputElement>(
    '[data-hook="jr-treatment-guidance-panel-contact-url"] input',
  );
  if (!field) {
    throw new Error('Expected the contact URL field');
  }
  return field;
}

beforeEach(() => {
  setProp.mockClear();
  getProp.mockReset();
});

test('jr-treatment-guidance panel loads the stored contact URL', async () => {
  getProp.mockResolvedValue('/custom-contact');
  const view = renderUi(<JrTreatmentGuidancePanel />);
  await act(async () => {
    await Promise.resolve();
  });

  expect(getProp).toHaveBeenCalledWith('contact-url');
  expect(fieldValue(view).value).toBe('/custom-contact');
  view.unmount();
});

test('jr-treatment-guidance panel writes edits back to the widget property', async () => {
  getProp.mockResolvedValue('');
  setProp.mockResolvedValue(undefined);
  const view = renderUi(<JrTreatmentGuidancePanel />);
  await act(async () => {
    await Promise.resolve();
  });

  const field = fieldValue(view);
  const nativeSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set;
  await act(async () => {
    nativeSetter?.call(field, '/get-in-touch');
    field.dispatchEvent(new Event('input', { bubbles: true }));
    await Promise.resolve();
  });

  expect(setProp).toHaveBeenCalledWith('contact-url', '/get-in-touch');
  view.unmount();
});
