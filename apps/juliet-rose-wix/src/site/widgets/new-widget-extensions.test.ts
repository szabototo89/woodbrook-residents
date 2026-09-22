import { expect, test } from 'vitest';

import { jrGiftCardPageExtension } from './jr-gift-card-page/jr-gift-card-page.extension';
import { jrHomePageExtension } from './jr-home-page/jr-home-page.extension';
import { jrStudioSectionsExtension } from './jr-studio-sections/jr-studio-sections.extension';
import { jrTreatmentHeroExtension } from './jr-treatment-hero/jr-treatment-hero.extension';
import { jrTreatmentsPageExtension } from './jr-treatments-page/jr-treatments-page.extension';

const extensions = [
  jrTreatmentHeroExtension,
  jrGiftCardPageExtension,
  jrStudioSectionsExtension,
  jrHomePageExtension,
  jrTreatmentsPageExtension,
];

test('new custom element manifests retain generated ids and opt-in installation', () => {
  for (const extension of extensions) {
    expect(extension.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(extension.name.length).toBeLessThanOrEqual(30);
    expect(extension.installation.autoAdd).toBe(false);
    expect(extension.width.stretchByDefault).toBe(true);
    expect(extension.presets[0].thumbnailUrl).toContain('{{BASE_URL}}');
  }
});

test('page-level building blocks have page-sized default heights', () => {
  expect(jrGiftCardPageExtension.height.defaultHeight).toBeGreaterThan(1000);
  expect(jrHomePageExtension.height.defaultHeight).toBeGreaterThan(2000);
  expect(jrTreatmentsPageExtension.height.defaultHeight).toBeGreaterThan(1200);
});
