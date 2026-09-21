import { expect, test } from 'vitest';

import { jrBookingPolicyExtension } from './jr-booking-policy.extension';

test('jr-booking-policy extension registers its tag with a valid widget name', () => {
  expect(jrBookingPolicyExtension.tagName).toBe('jr-booking-policy');
  expect(jrBookingPolicyExtension.name.length).toBeLessThanOrEqual(30);
  expect(jrBookingPolicyExtension.id).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
});

test('jr-booking-policy extension points at the element, panel, and preset thumbnail', () => {
  expect(jrBookingPolicyExtension.element).toBe(
    './site/widgets/jr-booking-policy/jr-booking-policy.tsx',
  );
  expect(jrBookingPolicyExtension.settings).toBe(
    './site/widgets/jr-booking-policy/jr-booking-policy.panel.tsx',
  );
  expect(jrBookingPolicyExtension.presets.length).toBeGreaterThan(0);
  expect(jrBookingPolicyExtension.presets[0]?.thumbnailUrl).toContain(
    '{{BASE_URL}}',
  );
});
