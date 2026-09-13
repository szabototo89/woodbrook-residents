// @vitest-environment happy-dom
import { afterEach, expect, test, vi } from 'vitest';

import { persistSelectedApp, readSelectedApp } from './appFocus';

afterEach(() => {
  vi.unstubAllGlobals();
  window.localStorage.clear();
});

test('selected app persists across navigation', () => {
  expect(readSelectedApp('web')).toBe('web');
  persistSelectedApp('cms');
  expect(readSelectedApp('web')).toBe('cms');
});

test('selected app falls back without a window', () => {
  vi.stubGlobal('window', undefined);
  expect(readSelectedApp('web')).toBe('web');
});
