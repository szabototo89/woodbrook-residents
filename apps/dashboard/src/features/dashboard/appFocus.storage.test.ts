// @vitest-environment happy-dom
import { Window } from 'happy-dom';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { persistSelectedApp, readSelectedApp } from './appFocus';

const testWindow = new Window({ url: 'https://woodbrook.local' });

beforeEach(() => {
  vi.stubGlobal('window', testWindow);
});

afterEach(() => {
  vi.unstubAllGlobals();
  testWindow.localStorage.clear();
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
