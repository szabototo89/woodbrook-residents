import { expect, test } from 'bun:test';

import {
  evaluateLighthouseScores,
  failedCombinations,
  mergeRetriedResults,
  routeReportFilename,
} from './lighthouse-report';

test('lighthouse score evaluation passes when every category meets its minimum', () => {
  const result = evaluateLighthouseScores(
    {
      performance: 95,
      accessibility: 98,
      'best-practices': 100,
      seo: 100,
    },
    {
      performance: 90,
      accessibility: 90,
      'best-practices': 90,
      seo: 90,
    },
  );

  expect(result.passed).toBe(true);
  expect(result.failures).toEqual([]);
});

test('lighthouse score evaluation reports each category below its minimum', () => {
  const result = evaluateLighthouseScores(
    {
      performance: 72,
      accessibility: 95,
      'best-practices': 88,
      seo: 100,
    },
    {
      performance: 90,
      accessibility: 90,
      'best-practices': 90,
      seo: 90,
    },
  );

  expect(result.passed).toBe(false);
  expect(result.failures).toEqual([
    'performance: 72 < 90',
    'best-practices: 88 < 90',
  ]);
});

test('lighthouse report filenames use a safe name for nested routes', () => {
  expect(routeReportFilename('/local-info', 'mobile')).toBe(
    'local-info.mobile.report.json',
  );
  expect(routeReportFilename('/', 'desktop')).toBe('home.desktop.report.json');
});

const passingScores = {
  performance: 95,
  accessibility: 100,
  'best-practices': 100,
  seo: 100,
};

const minimumScores = {
  performance: 90,
  accessibility: 90,
  'best-practices': 90,
  seo: 90,
};

test('lighthouse retry selection returns only the failing combinations', () => {
  expect(
    failedCombinations(
      [
        { route: '/', formFactor: 'mobile', scores: passingScores },
        {
          route: '/',
          formFactor: 'desktop',
          scores: { ...passingScores, performance: 89 },
        },
      ],
      minimumScores,
    ),
  ).toEqual([{ route: '/', formFactor: 'desktop' }]);
});

test('lighthouse retry selection returns nothing when everything passes', () => {
  expect(
    failedCombinations(
      [{ route: '/', formFactor: 'mobile', scores: passingScores }],
      minimumScores,
    ),
  ).toEqual([]);
});

test('lighthouse retry merge replaces retried results and keeps the rest', () => {
  expect(
    mergeRetriedResults(
      [
        { route: '/', formFactor: 'mobile', scores: passingScores },
        {
          route: '/',
          formFactor: 'desktop',
          scores: { ...passingScores, performance: 89 },
        },
      ],
      [
        {
          route: '/',
          formFactor: 'desktop',
          scores: { ...passingScores, performance: 94 },
        },
      ],
    ),
  ).toEqual([
    { route: '/', formFactor: 'mobile', scores: passingScores },
    {
      route: '/',
      formFactor: 'desktop',
      scores: { ...passingScores, performance: 94 },
    },
  ]);
});
