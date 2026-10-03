export type { LighthouseCategory } from '../../web/scripts/lighthouse-config';
export const LIGHTHOUSE_ROUTES: string[] = ['/', '/blog'];
export const LIGHTHOUSE_MIN_SCORES = {
  performance: 90,
  accessibility: 90,
  'best-practices': 90,
  seo: 90,
};
export const LIGHTHOUSE_PREVIEW_PORT = 4180;
export const LIGHTHOUSE_REPORT_DIR = 'lighthouse-reports';
