import { expect, test } from 'vitest';

import {
  parseLocalInfoSearch,
  serializeLocalInfoSearch,
} from './localInfoSearch';

test('local info search uses safe defaults for missing params', () => {
  expect(parseLocalInfoSearch({})).toEqual({
    query: '',
    category: 'all',
    outOfHoursOnly: false,
  });
});

test('local info search keeps valid filters and drops unknown categories', () => {
  expect(
    parseLocalInfoSearch({ q: 'plumber', category: 'trades', ooh: '1' }),
  ).toEqual({ query: 'plumber', category: 'trades', outOfHoursOnly: true });
  expect(parseLocalInfoSearch({ category: 'nope' }).category).toBe('all');
});

test('local info search serializes only active filters', () => {
  expect(
    serializeLocalInfoSearch({
      query: '',
      category: 'all',
      outOfHoursOnly: false,
    }),
  ).toEqual({});
  expect(
    serializeLocalInfoSearch({
      query: 'gp',
      category: 'health',
      outOfHoursOnly: true,
    }),
  ).toEqual({ q: 'gp', category: 'health', ooh: '1' });
});
