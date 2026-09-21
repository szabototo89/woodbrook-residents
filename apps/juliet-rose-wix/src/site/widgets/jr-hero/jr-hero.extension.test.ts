import { expect, test } from 'vitest';

import { jrHeroExtension } from './jr-hero.extension';

test('jr-hero extension registers the jr-hero tag with a valid widget name', () => {
  expect(jrHeroExtension.tagName).toBe('jr-hero');
  expect(jrHeroExtension.name.length).toBeLessThanOrEqual(30);
  expect(jrHeroExtension.id).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
});

test('jr-hero extension points at the element, panel, and preset thumbnail', () => {
  expect(jrHeroExtension.element).toBe('./site/widgets/jr-hero/jr-hero.tsx');
  expect(jrHeroExtension.settings).toBe(
    './site/widgets/jr-hero/jr-hero.panel.tsx',
  );
  expect(jrHeroExtension.presets.length).toBeGreaterThan(0);
  expect(jrHeroExtension.presets[0]?.thumbnailUrl).toContain('{{BASE_URL}}');
});
