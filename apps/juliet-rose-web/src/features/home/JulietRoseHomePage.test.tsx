import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import { JulietRoseHomePage } from './JulietRoseHomePage';

test('Juliet Rose home page presents the studio and its primary booking paths', () => {
  const markup = renderToStaticMarkup(<JulietRoseHomePage />);

  expect(markup).toContain('Relax and Revitalize');
  expect(markup).toContain('Find the right treatment for you');
  expect(markup).toContain('Featured treatments');
  expect(markup).toContain('The perfect gift');
  expect(markup).toContain('Juliet Rose beauty studio');
  expect(markup).toContain('https://www.julietrosebeauty.com/book-online');
});

test('Juliet Rose home page makes every treatment category a single visible booking link', () => {
  const markup = renderToStaticMarkup(<JulietRoseHomePage />);

  expect(markup.match(/class="category-card"/g)).toHaveLength(4);
  expect(markup).not.toContain('aria-label="View Facials');
  expect(markup).not.toContain('aria-label="Book Juliet Rose');
});

test('Juliet Rose home page prioritizes the hero image and defers below-the-fold images', () => {
  const markup = renderToStaticMarkup(<JulietRoseHomePage />);

  expect(markup).toContain('fetchPriority="high"');
  expect(markup.match(/loading="lazy"/g)).toHaveLength(9);
});
