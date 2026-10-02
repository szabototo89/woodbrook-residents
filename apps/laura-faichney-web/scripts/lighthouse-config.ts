export const LIGHTHOUSE_BASE_ROUTES = [
  '/',
  '/about',
  '/services',
  '/gallery',
  '/contact',
];

export function lighthouseRoutes(sitemap: string): string[] {
  const published = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => new URL(match[1]!).pathname,
  );
  return [...new Set([...LIGHTHOUSE_BASE_ROUTES, ...published])];
}

export type LighthouseCategory =
  'performance' | 'accessibility' | 'best-practices' | 'seo';
export const LIGHTHOUSE_MIN_SCORES: Record<LighthouseCategory, number> = {
  performance: 90,
  accessibility: 100,
  'best-practices': 100,
  seo: 100,
};
export const LIGHTHOUSE_PREVIEW_PORT = 4176;
export const LIGHTHOUSE_REPORT_DIR = 'lighthouse-reports';
