import { expect, test } from 'vitest';

import { siteWidgetExtensions } from './extensions';

test('site widget registry lists every Juliet Rose widget once', () => {
  expect(siteWidgetExtensions.map((widget) => widget.tagName)).toEqual([
    'jr-hero',
    'jr-category-grid',
    'jr-featured-grid',
    'jr-treatment-catalog',
    'jr-treatment-guidance',
    'jr-gift-card',
    'jr-visit-us',
    'jr-booking-policy',
    'jr-booking-journey',
  ]);
  const ids = siteWidgetExtensions.map((widget) => widget.id);
  expect(new Set(ids).size).toBe(ids.length);
});
