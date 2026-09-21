import { expect, test } from 'vitest';

import { jrCategoryGridExtension } from './jr-category-grid.extension';

test('jr-category-grid extension registers its tag with a valid widget name', () => {
  expect(jrCategoryGridExtension.tagName).toBe('jr-category-grid');
  expect(jrCategoryGridExtension.name.length).toBeLessThanOrEqual(30);
  expect(jrCategoryGridExtension.id).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
});

test('jr-category-grid extension points at the element, panel, and preset thumbnail', () => {
  expect(jrCategoryGridExtension.element).toBe(
    './site/widgets/jr-category-grid/jr-category-grid.tsx',
  );
  expect(jrCategoryGridExtension.settings).toBe(
    './site/widgets/jr-category-grid/jr-category-grid.panel.tsx',
  );
  expect(jrCategoryGridExtension.presets.length).toBeGreaterThan(0);
  expect(jrCategoryGridExtension.presets[0]?.thumbnailUrl).toContain(
    '{{BASE_URL}}',
  );
});
