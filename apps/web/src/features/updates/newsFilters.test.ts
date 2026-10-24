import { expect, test } from 'vitest';
import { parseNewsParams, selectNews } from './newsFilters';
import type { Update, UpdatesContent } from '../content/contentTypes';

const article = (
  title: string,
  kind: Update['kind'],
  publishedOn: string,
): Update => ({
  documentId: title,
  slug: title,
  title,
  kind,
  publishedOn,
  summary: 'Sample',
  body: 'Sample',
  sourceName: 'Sample',
  sourceUrl: 'https://example.com',
  sourceReviewedOn: '2026-10-24',
  featured: false,
});
const feature = article('Featured transport', 'transport', '2025-01-01');
const content: UpdatesContent = {
  availability: 'ready',
  featuredUpdate: feature,
  items: [
    article('New housing', 'housing', '2026-02-01'),
    article('Old transport', 'transport', '2024-01-01'),
  ],
};

test('validates saved filters and safely defaults invalid URL values', () => {
  expect(parseNewsParams({})).toEqual({ category: 'all', sort: 'newest' });
  expect(parseNewsParams({ category: 'transport', sort: 'oldest' })).toEqual({
    category: 'transport',
    sort: 'oldest',
  });
  for (const category of ['invalid', ['transport'], null, 42]) {
    expect(parseNewsParams({ category, sort: 'invalid' })).toEqual({
      category: 'all',
      sort: 'newest',
    });
  }
});

test('default view retains the editorial feature without duplicating it', () => {
  expect(selectNews(content, parseNewsParams({}))).toEqual({
    featuredUpdate: feature,
    items: content.items,
  });
});

test('category selection includes a matching feature once in chronological results', () => {
  expect(
    selectNews(content, { category: 'transport', sort: 'oldest' }),
  ).toEqual({
    featuredUpdate: undefined,
    items: [content.items[1], feature],
  });
  expect(
    selectNews(content, { category: 'transport', sort: 'newest' }).items,
  ).toEqual([feature, content.items[1]]);
  expect(
    selectNews(content, { category: 'parks', sort: 'newest' }).items,
  ).toEqual([]);
});

test('oldest first sorts the whole collection without mutating it', () => {
  const original = structuredClone(content);
  expect(
    selectNews(content, { category: 'all', sort: 'oldest' }).items.map(
      (item) => item.title,
    ),
  ).toEqual(['Old transport', 'Featured transport', 'New housing']);
  expect(content).toEqual(original);
});

test('date sorting respects time zones and stable equal-date ordering', () => {
  const items = [
    article('First', 'news', '2026-01-01T10:00:00+02:00'),
    article('Second', 'news', '2026-01-01T09:00:00Z'),
    article('Third', 'news', '2026-01-01T09:00:00Z'),
  ];
  expect(
    selectNews(
      { availability: 'ready', items },
      { category: 'news', sort: 'newest' },
    ).items.map((item) => item.title),
  ).toEqual(['Second', 'Third', 'First']);
  expect(
    selectNews({ availability: 'ready', items: [] }, parseNewsParams({})).items,
  ).toEqual([]);
});
