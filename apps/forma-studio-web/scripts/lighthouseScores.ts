import {
  toLighthouseScores,
  type LighthouseScores,
} from '../../web/scripts/lighthouse-report';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function lighthouseScoresFromReport(report: unknown): LighthouseScores {
  if (!isRecord(report) || !isRecord(report.categories)) {
    throw new Error('Invalid Lighthouse categories');
  }
  const categories = report.categories;
  return toLighthouseScores((category) => {
    const entry = categories[category];
    const score = isRecord(entry) ? entry.score : undefined;
    return typeof score === 'number' &&
      Number.isFinite(score) &&
      score >= 0 &&
      score <= 1
      ? Math.round(score * 100)
      : 0;
  });
}
