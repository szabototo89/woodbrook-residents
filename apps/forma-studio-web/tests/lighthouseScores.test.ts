import { expect, test } from 'vitest';
import { lighthouseScoresFromReport } from '../scripts/lighthouseScores';

test('Lighthouse scores come from validated numeric category values', () => {
  expect(
    lighthouseScoresFromReport({
      categories: {
        performance: { score: 0.915 },
        accessibility: { score: 1 },
        'best-practices': { score: 0 },
        seo: { score: 0.9 },
      },
    }),
  ).toEqual({
    performance: 92,
    accessibility: 100,
    'best-practices': 0,
    seo: 90,
  });
});

test.each([null, [], 'report', {}, { categories: null }, { categories: [] }])(
  'Lighthouse rejects a malformed report: %j',
  (report) => {
    expect(() => lighthouseScoresFromReport(report)).toThrow(
      'Invalid Lighthouse categories',
    );
  },
);

test.each([
  undefined,
  null,
  '0.99',
  -1,
  1.1,
  Number.NaN,
  Number.POSITIVE_INFINITY,
])(
  'Lighthouse treats missing or invalid scores as a failed score: %s',
  (score) => {
    expect(
      lighthouseScoresFromReport({ categories: { performance: { score } } }),
    ).toEqual({
      performance: 0,
      accessibility: 0,
      'best-practices': 0,
      seo: 0,
    });
  },
);
