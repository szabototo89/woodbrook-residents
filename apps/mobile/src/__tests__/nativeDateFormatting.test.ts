import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import {
  readableDate,
  readableDateTime,
} from '../features/content/contentModels.js';

beforeEach(() => vi.stubGlobal('Intl', undefined));
afterEach(() => vi.unstubAllGlobals());

test.each([
  ['2026-01-02T03:04:00', '2 Jan 2026'],
  ['2026-02-02T03:04:00', '2 Feb 2026'],
  ['2026-03-02T03:04:00', '2 Mar 2026'],
  ['2026-04-02T03:04:00', '2 Apr 2026'],
  ['2026-05-02T03:04:00', '2 May 2026'],
  ['2026-06-02T03:04:00', '2 Jun 2026'],
  ['2026-07-02T03:04:00', '2 Jul 2026'],
  ['2026-08-02T03:04:00', '2 Aug 2026'],
  ['2026-09-02T03:04:00', '2 Sept 2026'],
  ['2026-10-02T03:04:00', '2 Oct 2026'],
  ['2026-11-02T03:04:00', '2 Nov 2026'],
  ['2026-12-02T03:04:00', '2 Dec 2026'],
])('formats %s without requiring the native Intl API', (value, expected) => {
  expect(readableDate(value)).toBe(expected);
});

test.each([
  ['2026-09-12T00:05:00', '12 Sept 2026, 00:05'],
  ['2026-10-01T18:00:00', '1 Oct 2026, 18:00'],
  ['2028-02-29T23:59:00', '29 Feb 2028, 23:59'],
])(
  'preserves readable dates and 24-hour local times for %s',
  (value, expected) => {
    expect(readableDateTime(value)).toBe(expected);
  },
);

test.each([readableDate, readableDateTime])(
  'rejects invalid dates instead of displaying broken copy',
  (format) => {
    expect(() => format('not-a-date')).toThrow(RangeError);
  },
);
