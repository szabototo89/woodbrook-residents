import { expect, test } from 'vitest';

import { jrVisitUsExtension } from './jr-visit-us.extension';

test('jr-visit-us extension registers its tag with a valid widget name', () => {
  expect(jrVisitUsExtension.tagName).toBe('jr-visit-us');
  expect(jrVisitUsExtension.name.length).toBeLessThanOrEqual(30);
  expect(jrVisitUsExtension.id).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
});

test('jr-visit-us extension points at the element, panel, and preset thumbnail', () => {
  expect(jrVisitUsExtension.element).toBe(
    './site/widgets/jr-visit-us/jr-visit-us.tsx',
  );
  expect(jrVisitUsExtension.settings).toBe(
    './site/widgets/jr-visit-us/jr-visit-us.panel.tsx',
  );
  expect(jrVisitUsExtension.presets.length).toBeGreaterThan(0);
  expect(jrVisitUsExtension.presets[0]?.thumbnailUrl).toContain('{{BASE_URL}}');
});
