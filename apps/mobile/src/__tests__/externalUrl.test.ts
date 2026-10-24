import { afterEach, expect, test, vi } from 'vitest';

import {
  OPEN_URL_EVENT,
  domainOf,
  openExternalUrl,
  requestedUrl,
} from '../features/content/externalUrl.js';

afterEach(() => {
  vi.unstubAllGlobals();
});

test('domainOf shows a short host instead of the full URL', () => {
  expect(domainOf('https://www.dlrcoco.ie/en/news')).toBe('dlrcoco.ie');
  expect(domainOf('https://example.com/respond')).toBe('example.com');
  expect(domainOf('not a url')).toBe('not a url');
  expect(domainOf('https://')).toBe('https://');
});

test('openExternalUrl stays silent without an opener or host document', () => {
  vi.stubGlobal('open', undefined);
  vi.stubGlobal('document', undefined);
  vi.stubGlobal('CustomEvent', undefined);

  expect(() => openExternalUrl('https://example.com/x')).not.toThrow();
});

test('openExternalUrl opens a new tab when a window opener exists', () => {
  const open = vi.fn();
  vi.stubGlobal('open', open);

  openExternalUrl('https://example.com/book');

  expect(open).toHaveBeenCalledWith(
    'https://example.com/book',
    '_blank',
    'noopener,noreferrer',
  );
});

test('openExternalUrl reports whether the tap was handled', () => {
  const open = vi.fn();
  vi.stubGlobal('open', open);
  expect(openExternalUrl('https://example.com/book')).toBe(true);

  vi.stubGlobal('open', undefined);
  vi.stubGlobal('document', undefined);
  vi.stubGlobal('CustomEvent', undefined);
  expect(openExternalUrl('https://example.com/book')).toBe(false);
});

test('openExternalUrl notifies the browser host when no window opener exists', () => {
  vi.stubGlobal('open', undefined);
  const seen: Array<string> = [];
  const onEvent = (event: Event) => {
    const url = requestedUrl(event);
    if (url) seen.push(url);
  };
  document.addEventListener(OPEN_URL_EVENT, onEvent);

  openExternalUrl('https://example.com/respond');

  document.removeEventListener(OPEN_URL_EVENT, onEvent);
  expect(seen).toEqual(['https://example.com/respond']);
});

test('openExternalUrl uses a native module when one exists', () => {
  vi.stubGlobal('open', undefined);
  const openUrl = vi.fn();
  vi.stubGlobal('NativeModules', { openUrl });
  expect(openExternalUrl('https://example.com/book')).toBe(true);
  expect(openUrl).toHaveBeenCalledWith('https://example.com/book');

  const call = vi.fn((_method: string, _args: unknown, done: () => void) =>
    done(),
  );
  vi.stubGlobal('NativeModules', { bridge: { call } });
  expect(openExternalUrl('https://example.com/book')).toBe(true);
  expect(call).toHaveBeenCalledWith(
    'openUrl',
    { url: 'https://example.com/book' },
    expect.any(Function),
  );
});
