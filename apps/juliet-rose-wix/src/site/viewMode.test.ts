import { expect, test, vi } from 'vitest';

import { resolveViewMode } from './viewMode';

vi.mock('@wix/site-window', () => ({
  window: {
    viewMode: vi.fn(),
  },
}));

import { window as wixWindow } from '@wix/site-window';

const viewMode = vi.mocked(wixWindow.viewMode);

test('resolveViewMode passes Preview and Site through', async () => {
  viewMode.mockResolvedValueOnce('Preview');
  await expect(resolveViewMode()).resolves.toBe('Preview');
  viewMode.mockResolvedValueOnce('Site');
  await expect(resolveViewMode()).resolves.toBe('Site');
});

test('resolveViewMode falls back to Editor for unknown modes', async () => {
  viewMode.mockResolvedValueOnce('Dashboard');
  await expect(resolveViewMode()).resolves.toBe('Editor');
});

test('resolveViewMode falls back to Editor when the API throws', async () => {
  viewMode.mockRejectedValueOnce(new Error('sandbox'));
  await expect(resolveViewMode()).resolves.toBe('Editor');
});
