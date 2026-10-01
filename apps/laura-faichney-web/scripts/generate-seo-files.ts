import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PRODUCTION_SITE_URL, resolveSiteUrl } from '../src/app/siteMetadata';
import { galleryCollections } from '../src/features/site/siteContent';
import { galleryCollectionPath } from '../src/features/site/galleryContent';

const appRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const outputRoot = path.join(appRoot, 'dist', 'client');

export const STATIC_ROUTES = [
  '/',
  '/services',
  '/gallery',
  '/about',
  '/contact',
  ...galleryCollections.map(galleryCollectionPath),
];

export function resolveSeoSiteUrlFromEnv(
  env: Record<string, string | undefined>,
): string {
  return resolveSiteUrl({
    VITE_PUBLIC_SITE_URL: env['VITE_PUBLIC_SITE_URL'] ?? PRODUCTION_SITE_URL,
  });
}

async function generateSeoFiles() {
  const siteUrl = resolveSeoSiteUrlFromEnv(process.env);
  console.log(`Generating SEO files for ${siteUrl}...`);
  const sitemapUrls = STATIC_ROUTES.map(
    (route) => `  <url><loc>${siteUrl}${route}</loc></url>`,
  ).join('\n');
  const sitemapXml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    `${sitemapUrls}\n` +
    '</urlset>\n';
  const robotsTxt = `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`;

  await Bun.write(path.join(outputRoot, 'sitemap.xml'), sitemapXml);
  await Bun.write(path.join(outputRoot, 'robots.txt'), robotsTxt);

  console.log(`Wrote sitemap.xml and robots.txt for ${siteUrl}.`);
}

try {
  await generateSeoFiles();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
