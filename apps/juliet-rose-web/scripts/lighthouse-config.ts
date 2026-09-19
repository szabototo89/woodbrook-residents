export const LIGHTHOUSE_ROUTES: string[] = ['/'];

export type LighthouseCategory =
  'performance' | 'accessibility' | 'best-practices' | 'seo';

export const LIGHTHOUSE_MIN_SCORES: Record<LighthouseCategory, number> = {
  performance: 90,
  accessibility: 90,
  'best-practices': 90,
  seo: 90,
};

export const LIGHTHOUSE_PREVIEW_PORT = 4175;
export const LIGHTHOUSE_REPORT_DIR = 'lighthouse-reports';
