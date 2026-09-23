import { act } from 'react';
import { beforeEach, expect, test, vi } from 'vitest';

import { renderUi } from '../../test-utils/renderUi';

vi.mock('@wix/editor', () => ({
  widget: { getProp: vi.fn(), setProp: vi.fn() },
}));

import { widget } from '@wix/editor';
import { usePanelProps } from './usePanelProps';
import { useState } from 'react';

const getProp = vi.mocked(widget.getProp);
const setProp = vi.mocked(widget.setProp);

function Harness(props: Readonly<{ keys: readonly string[] }>) {
  const panel = usePanelProps(props.keys);
  const [draft, setDraft] = useState('');
  void draft;
  void setDraft;
  return (
    <div>
      <span data-hook="status">{panel.status}</span>
      <span data-hook="error">{panel.error ?? ''}</span>
      <span data-hook="initial-service">
        {panel.values['initial-service'] ?? ''}
      </span>
      <button
        data-hook="save"
        type="button"
        onClick={() => {
          void panel.save('initial-service', 'new-slug');
        }}
      >
        save
      </button>
    </div>
  );
}

function text(hook: string, container: HTMLElement) {
  const node = container.querySelector(`[data-hook="${hook}"]`);
  if (!node) throw new Error(`Missing [data-hook="${hook}"]`);
  return node.textContent ?? '';
}

beforeEach(() => {
  getProp.mockReset();
  setProp.mockReset();
});

test('usePanelProps starts loading then fills values from getProp', async () => {
  getProp.mockImplementation(async (key: string) => `stored:${key}`);
  const view = renderUi(<Harness keys={['initial-service']} />);
  expect(text('status', view.container)).toBe('loading');
  await act(async () => {
    await Promise.resolve();
  });
  expect(text('status', view.container)).toBe('ready');
  expect(text('initial-service', view.container)).toBe(
    'stored:initial-service',
  );
  expect(getProp).toHaveBeenCalledWith('initial-service');
  view.unmount();
});

test('usePanelProps save updates local value and persists via setProp', async () => {
  getProp.mockResolvedValue('');
  setProp.mockResolvedValue(undefined);
  const view = renderUi(<Harness keys={['initial-service']} />);
  await act(async () => {
    await Promise.resolve();
  });
  const button = view.container.querySelector('[data-hook="save"]');
  if (!(button instanceof HTMLElement)) throw new Error('Missing save button');
  await act(async () => {
    button.click();
    await Promise.resolve();
  });
  expect(setProp).toHaveBeenCalledWith('initial-service', 'new-slug');
  expect(text('initial-service', view.container)).toBe('new-slug');
  view.unmount();
});

test('usePanelProps surfaces load failures instead of blank fields', async () => {
  getProp.mockRejectedValue(new Error('editor locked'));
  const view = renderUi(<Harness keys={['initial-service']} />);
  await act(async () => {
    await Promise.resolve();
  });
  expect(text('status', view.container)).toBe('error');
  expect(text('error', view.container)).toMatch(/editor locked/);
  view.unmount();
});
