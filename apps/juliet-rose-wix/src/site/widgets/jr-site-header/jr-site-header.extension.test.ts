import { expect, test } from 'vitest';

import { jrSiteHeaderExtension } from './jr-site-header.extension';

test('jr-site-header extension registers its tag with a valid widget name', () => {
  expect(jrSiteHeaderExtension.tagName).toBe('jr-site-header');
  expect(jrSiteHeaderExtension.name.length).toBeLessThanOrEqual(30);
  expect(jrSiteHeaderExtension.id).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
});

test('jr-site-header extension points at the element, panel, and preset thumbnail', () => {
  expect(jrSiteHeaderExtension.element).toBe(
    './site/widgets/jr-site-header/jr-site-header.tsx',
  );
  expect(jrSiteHeaderExtension.settings).toBe(
    './site/widgets/jr-site-header/jr-site-header.panel.tsx',
  );
  expect(jrSiteHeaderExtension.presets.length).toBeGreaterThan(0);
  expect(jrSiteHeaderExtension.presets[0]?.thumbnailUrl).toContain(
    '{{BASE_URL}}',
  );
});
