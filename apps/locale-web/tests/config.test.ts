import { readFileSync } from 'node:fs';
import { test, expect } from 'vitest';
import {
  LIGHTHOUSE_MIN_SCORES,
  LIGHTHOUSE_ROUTES,
} from '../scripts/lighthouse-config';
import { evaluateLighthouseScores } from '../../web/scripts/lighthouse-report';

const read = (file: string) => readFileSync(`${process.cwd()}/${file}`, 'utf8');

test('Cloudflare publishes the client directory with security and asset cache headers', () => {
  expect(
    JSON.parse(read('wrangler.jsonc').replace(/,\s*}/g, '}'))
      .pages_build_output_dir,
  ).toBe('./dist/client');
  expect(read('public/_headers')).toContain('X-Content-Type-Options: nosniff');
  expect(read('public/_headers')).toContain(
    'Cache-Control: public, max-age=31536000, immutable',
  );
});

test('Lighthouse accepts the homepage only when all scores meet the minimum', () => {
  expect(LIGHTHOUSE_ROUTES).toEqual(['/', '/blog']);
  expect(
    evaluateLighthouseScores(
      { performance: 90, accessibility: 90, 'best-practices': 90, seo: 90 },
      LIGHTHOUSE_MIN_SCORES,
    ).passed,
  ).toBe(true);
});

test.each(['performance', 'accessibility', 'best-practices', 'seo'])(
  'Lighthouse rejects a below-threshold %s score',
  (category) => {
    const scores = {
      performance: 100,
      accessibility: 100,
      'best-practices': 100,
      seo: 100,
      [category]: 89,
    };
    const evaluation = evaluateLighthouseScores(scores, LIGHTHOUSE_MIN_SCORES);
    expect(evaluation.passed).toBe(false);
    expect(evaluation.failures).toEqual([expect.stringContaining(category)]);
  },
);
