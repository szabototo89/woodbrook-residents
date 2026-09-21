import { expect, test } from 'vitest';

import { jrTreatmentCatalogExtension } from './jr-treatment-catalog.extension';

test('jr-treatment-catalog extension registers its tag with a valid widget name', () => {
  expect(jrTreatmentCatalogExtension.tagName).toBe('jr-treatment-catalog');
  expect(jrTreatmentCatalogExtension.name.length).toBeLessThanOrEqual(30);
  expect(jrTreatmentCatalogExtension.id).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
});

test('jr-treatment-catalog extension points at the element, panel, and preset thumbnail', () => {
  expect(jrTreatmentCatalogExtension.element).toBe(
    './site/widgets/jr-treatment-catalog/jr-treatment-catalog.tsx',
  );
  expect(jrTreatmentCatalogExtension.settings).toBe(
    './site/widgets/jr-treatment-catalog/jr-treatment-catalog.panel.tsx',
  );
  expect(jrTreatmentCatalogExtension.presets.length).toBeGreaterThan(0);
  expect(jrTreatmentCatalogExtension.presets[0]?.thumbnailUrl).toContain(
    '{{BASE_URL}}',
  );
});
