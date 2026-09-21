import { expect, test } from 'vitest';

import { jrFeaturedGridExtension } from './jr-featured-grid.extension';

test('jr-featured-grid extension registers its tag with a valid widget name', () => {
  expect(jrFeaturedGridExtension.tagName).toBe('jr-featured-grid');
  expect(jrFeaturedGridExtension.name.length).toBeLessThanOrEqual(30);
  expect(jrFeaturedGridExtension.id).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
});

test('jr-featured-grid extension points at the element, panel, and preset thumbnail', () => {
  expect(jrFeaturedGridExtension.element).toBe(
    './site/widgets/jr-featured-grid/jr-featured-grid.tsx',
  );
  expect(jrFeaturedGridExtension.settings).toBe(
    './site/widgets/jr-featured-grid/jr-featured-grid.panel.tsx',
  );
  expect(jrFeaturedGridExtension.presets.length).toBeGreaterThan(0);
  expect(jrFeaturedGridExtension.presets[0]?.thumbnailUrl).toContain(
    '{{BASE_URL}}',
  );
});
