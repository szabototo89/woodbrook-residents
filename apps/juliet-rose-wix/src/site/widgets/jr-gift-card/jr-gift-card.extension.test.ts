import { expect, test } from 'vitest';

import { jrGiftCardExtension } from './jr-gift-card.extension';

test('jr-gift-card extension registers its tag with a valid widget name', () => {
  expect(jrGiftCardExtension.tagName).toBe('jr-gift-card');
  expect(jrGiftCardExtension.name.length).toBeLessThanOrEqual(30);
  expect(jrGiftCardExtension.id).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
});

test('jr-gift-card extension points at the element, panel, and preset thumbnail', () => {
  expect(jrGiftCardExtension.element).toBe(
    './site/widgets/jr-gift-card/jr-gift-card.tsx',
  );
  expect(jrGiftCardExtension.settings).toBe(
    './site/widgets/jr-gift-card/jr-gift-card.panel.tsx',
  );
  expect(jrGiftCardExtension.presets.length).toBeGreaterThan(0);
  expect(jrGiftCardExtension.presets[0]?.thumbnailUrl).toContain(
    '{{BASE_URL}}',
  );
});
