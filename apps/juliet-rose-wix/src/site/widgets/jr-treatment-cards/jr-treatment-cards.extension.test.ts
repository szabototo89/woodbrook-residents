import { expect, test } from 'vitest';

import { jrTreatmentCardsExtension } from './jr-treatment-cards.extension';

test('jr-treatment-cards extension registers its tag with a valid widget name', () => {
  expect(jrTreatmentCardsExtension.tagName).toBe('jr-treatment-cards');
  expect(jrTreatmentCardsExtension.name.length).toBeLessThanOrEqual(30);
  expect(jrTreatmentCardsExtension.id).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
});

test('jr-treatment-cards extension points at the element, panel, and preset thumbnail', () => {
  expect(jrTreatmentCardsExtension.element).toBe(
    './site/widgets/jr-treatment-cards/jr-treatment-cards.tsx',
  );
  expect(jrTreatmentCardsExtension.settings).toBe(
    './site/widgets/jr-treatment-cards/jr-treatment-cards.panel.tsx',
  );
  expect(jrTreatmentCardsExtension.presets.length).toBeGreaterThan(0);
  expect(jrTreatmentCardsExtension.presets[0]?.thumbnailUrl).toContain(
    '{{BASE_URL}}',
  );
});
