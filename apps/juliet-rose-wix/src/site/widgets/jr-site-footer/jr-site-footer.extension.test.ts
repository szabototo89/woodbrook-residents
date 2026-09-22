import { expect, test } from 'vitest';

import { jrSiteFooterExtension } from './jr-site-footer.extension';

test('jr-site-footer extension registers its tag with a valid widget name', () => {
  expect(jrSiteFooterExtension.tagName).toBe('jr-site-footer');
  expect(jrSiteFooterExtension.name.length).toBeLessThanOrEqual(30);
  expect(jrSiteFooterExtension.id).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
});

test('jr-site-footer extension points at the element, panel, and preset thumbnail', () => {
  expect(jrSiteFooterExtension.element).toBe(
    './site/widgets/jr-site-footer/jr-site-footer.tsx',
  );
  expect(jrSiteFooterExtension.settings).toBe(
    './site/widgets/jr-site-footer/jr-site-footer.panel.tsx',
  );
  expect(jrSiteFooterExtension.presets.length).toBeGreaterThan(0);
  expect(jrSiteFooterExtension.presets[0]?.thumbnailUrl).toContain(
    '{{BASE_URL}}',
  );
});
