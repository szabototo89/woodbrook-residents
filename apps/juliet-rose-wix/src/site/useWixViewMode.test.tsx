import { act } from 'react';
import { beforeEach, expect, test, vi } from 'vitest';

import { renderUi } from '../test-utils/renderUi';

vi.mock('@wix/site-window', () => ({
  window: { viewMode: vi.fn() },
}));

import { window as wixWindow } from '@wix/site-window';
import { useWixViewMode } from './useWixViewMode';

const viewMode = vi.mocked(wixWindow.viewMode);

function ViewModeProbe(props: { explicit?: 'Editor' | 'Preview' | 'Site' }) {
  return <p>{useWixViewMode(props.explicit)}</p>;
}

beforeEach(() => {
  viewMode.mockReset();
});

test('resolves the runtime view mode when a widget prop is not supplied', async () => {
  viewMode.mockResolvedValue('Site');
  const view = renderUi(<ViewModeProbe />);

  expect(view.container.textContent).toBe('Editor');
  await act(async () => {
    await Promise.resolve();
  });

  expect(view.container.textContent).toBe('Site');
  expect(viewMode).toHaveBeenCalledTimes(1);
  view.unmount();
});

test('uses an explicit mode without consulting the Wix runtime', async () => {
  const view = renderUi(<ViewModeProbe explicit="Preview" />);
  await act(async () => {
    await Promise.resolve();
  });

  expect(view.container.textContent).toBe('Preview');
  expect(viewMode).not.toHaveBeenCalled();
  view.unmount();
});
