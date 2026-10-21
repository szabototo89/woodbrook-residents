import { expect, test } from 'vitest';

import { sampleSearchSnapshot as snapshot } from '../../test-utils/searchContent';
import {
  buildSearchIndex,
  parseSearchParams,
  searchContent,
  searchCategories,
} from './searchModel';

test('places services immediately after all results', () => {
  expect(searchCategories.map((category) => category.label)).toEqual([
    'All',
    'Services',
    'News',
    'Projects',
    'Events',
  ]);
});

test('validates URL state and bounds the search input', () => {
  expect(parseSearchParams({ q: '  DART  ', category: 'events' })).toEqual({
    q: 'DART',
    category: 'events',
  });
  expect(parseSearchParams({ q: 42, category: 'unknown' })).toEqual({
    q: '',
    category: 'all',
  });
  expect(
    parseSearchParams({ q: 'a'.repeat(150), category: 'all' }).q,
  ).toHaveLength(120);
});

test('indexes every published collection with canonical destinations and original records for shared cards', () => {
  const index = buildSearchIndex(snapshot);
  expect(index.map((item) => item.href)).toEqual([
    '/updates/sample',
    '/surveys/sample',
    '/projects/sample',
    '/events/sample',
    '/local-info/sample',
  ]);
  expect(index.map((item) => item.kind)).toEqual([
    'update',
    'survey',
    'project',
    'event',
    'service',
  ]);
  expect(index.map((item) => item.record)).toEqual([
    snapshot.updates[0],
    snapshot.surveys[0],
    snapshot.projects[0],
    snapshot.events[0],
    snapshot.resources[0],
  ]);
  expect(new Set(index.map((item) => item.id)).size).toBe(5);
});

test('matches all words case-insensitively across visible copy and full content', () => {
  const index = buildSearchIndex(snapshot);
  expect(searchContent(index, { q: 'dArT', category: 'all' }).counts).toEqual({
    all: 5,
    updates: 2,
    projects: 1,
    events: 1,
    services: 1,
  });
  expect(
    searchContent(index, {
      q: 'step-free platforms',
      category: 'all',
    }).results.map((item) => item.href),
  ).toEqual(['/updates/sample']);
  expect(
    searchContent(index, { q: 'sample stop', category: 'all' }).results.map(
      (item) => item.category,
    ),
  ).toEqual(['services']);
  expect(
    searchContent(index, { q: 'DART impossible', category: 'all' }).results,
  ).toEqual([]);
});

test('category filtering preserves query-wide counts and does not mutate the index', () => {
  const index = buildSearchIndex(snapshot);
  const result = searchContent(index, { q: 'DART', category: 'projects' });
  expect(result.results.map((item) => item.href)).toEqual(['/projects/sample']);
  expect(result.counts.all).toBe(5);
  expect(index).toHaveLength(5);
  expect(searchContent(index, { q: '', category: 'all' }).counts.all).toBe(0);
});
