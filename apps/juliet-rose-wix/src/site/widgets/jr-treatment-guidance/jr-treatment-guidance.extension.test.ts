import { expect, test } from 'vitest';

import { jrTreatmentGuidanceExtension } from './jr-treatment-guidance.extension';

test('jr-treatment-guidance extension registers its tag with a valid widget name', () => {
  expect(jrTreatmentGuidanceExtension.tagName).toBe('jr-treatment-guidance');
  expect(jrTreatmentGuidanceExtension.name.length).toBeLessThanOrEqual(30);
  expect(jrTreatmentGuidanceExtension.id).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
});

test('jr-treatment-guidance extension points at the element, panel, and preset thumbnail', () => {
  expect(jrTreatmentGuidanceExtension.element).toBe(
    './site/widgets/jr-treatment-guidance/jr-treatment-guidance.tsx',
  );
  expect(jrTreatmentGuidanceExtension.settings).toBe(
    './site/widgets/jr-treatment-guidance/jr-treatment-guidance.panel.tsx',
  );
  expect(jrTreatmentGuidanceExtension.presets.length).toBeGreaterThan(0);
  expect(jrTreatmentGuidanceExtension.presets[0]?.thumbnailUrl).toContain(
    '{{BASE_URL}}',
  );
});
