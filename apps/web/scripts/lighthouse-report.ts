import type { LighthouseCategory } from './lighthouse-config';

export type LighthouseScores = Record<LighthouseCategory, number>;

const CATEGORIES: LighthouseCategory[] = [
  'performance',
  'accessibility',
  'best-practices',
  'seo',
];

export function evaluateLighthouseScores(
  scores: LighthouseScores,
  minimums: LighthouseScores,
): { passed: boolean; failures: string[] } {
  const failures = CATEGORIES.flatMap((category) => {
    const score = scores[category];
    const minimum = minimums[category];
    return score < minimum ? [`${category}: ${score} < ${minimum}`] : [];
  });

  return { passed: failures.length === 0, failures };
}

export function toLighthouseScores(
  scoreFor: (category: LighthouseCategory) => number,
): LighthouseScores {
  return {
    performance: scoreFor('performance'),
    accessibility: scoreFor('accessibility'),
    'best-practices': scoreFor('best-practices'),
    seo: scoreFor('seo'),
  };
}

export function routeReportFilename(
  route: string,
  formFactor: 'mobile' | 'desktop',
): string {
  const slug = route.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
  return `${slug === '' ? 'home' : slug}.${formFactor}.report.json`;
}
