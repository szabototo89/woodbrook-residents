import { expect, test } from 'bun:test';
import { lighthouseRoutes, LIGHTHOUSE_MIN_SCORES } from './lighthouse-config';

test('audits every public page and published collection from the build sitemap', () => {
  expect(
    lighthouseRoutes(
      '<urlset><url><loc>https://example.com/</loc></url><url><loc>https://example.com/gallery/mad-cow</loc></url></urlset>',
    ),
  ).toEqual([
    '/',
    '/about',
    '/services',
    '/gallery',
    '/contact',
    '/gallery/mad-cow',
  ]);
});

test('requires fast pages and perfect accessibility, best practices and SEO', () => {
  expect(LIGHTHOUSE_MIN_SCORES).toEqual({
    performance: 90,
    accessibility: 100,
    'best-practices': 100,
    seo: 100,
  });
});

test('uses the localhost origin registered with the CMS for collection preloading', async () => {
  const { LIGHTHOUSE_PREVIEW_PORT } = await import('./lighthouse-config');
  expect(LIGHTHOUSE_PREVIEW_PORT).toBe(4176);
});
