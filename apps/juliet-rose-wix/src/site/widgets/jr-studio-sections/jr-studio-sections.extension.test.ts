import { expect, test } from 'vitest';

import { jrStudioSectionsExtension } from './jr-studio-sections.extension';

test('jr-studio-sections extension registers its tag with a valid widget name', () => {
  expect(jrStudioSectionsExtension.tagName).toBe('jr-studio-sections');
  expect(jrStudioSectionsExtension.name.length).toBeLessThanOrEqual(30);
  expect(jrStudioSectionsExtension.id).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
});

test('jr-studio-sections extension points at the element, panel, and preset thumbnail', () => {
  expect(jrStudioSectionsExtension.element).toBe(
    './site/widgets/jr-studio-sections/jr-studio-sections.tsx',
  );
  expect(jrStudioSectionsExtension.settings).toBe(
    './site/widgets/jr-studio-sections/jr-studio-sections.panel.tsx',
  );
  expect(jrStudioSectionsExtension.presets.length).toBeGreaterThan(0);
  expect(jrStudioSectionsExtension.presets[0]?.thumbnailUrl).toContain(
    '{{BASE_URL}}',
  );
});
