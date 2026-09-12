import { describe, expect, test } from 'bun:test';

import { LIGHTHOUSE_MIN_SCORES, LIGHTHOUSE_ROUTES } from './lighthouse-config';

describe('lighthouse harness configuration', () => {
  test('covers the key public routes', () => {
    for (const requiredPath of [
      '/',
      '/events',
      '/local-info',
      '/projects',
      '/surveys',
      '/updates',
      '/get-involved',
    ]) {
      expect(LIGHTHOUSE_ROUTES).toContain(requiredPath);
    }
  });

  test('enforces a 90 minimum for every Lighthouse category', () => {
    for (const category of [
      'performance',
      'accessibility',
      'best-practices',
      'seo',
    ] as const) {
      expect(LIGHTHOUSE_MIN_SCORES[category]).toBeGreaterThanOrEqual(90);
    }
  });
});
