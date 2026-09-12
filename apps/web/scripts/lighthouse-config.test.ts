import { expect, test } from 'bun:test';

import { LIGHTHOUSE_MIN_SCORES, LIGHTHOUSE_ROUTES } from './lighthouse-config';

test('lighthouse harness configuration covers the key public routes', () => {
  const requiredPaths = [
    '/',
    '/events',
    '/local-info',
    '/projects',
    '/surveys',
    '/updates',
    '/get-involved',
  ];
  expect(
    requiredPaths.every((requiredPath) =>
      LIGHTHOUSE_ROUTES.includes(requiredPath),
    ),
  ).toBe(true);
});

test('lighthouse harness configuration enforces a 90 minimum for every category', () => {
  expect(LIGHTHOUSE_MIN_SCORES.performance).toBeGreaterThanOrEqual(90);
  expect(LIGHTHOUSE_MIN_SCORES.accessibility).toBeGreaterThanOrEqual(90);
  expect(LIGHTHOUSE_MIN_SCORES['best-practices']).toBeGreaterThanOrEqual(90);
  expect(LIGHTHOUSE_MIN_SCORES.seo).toBeGreaterThanOrEqual(90);
});
