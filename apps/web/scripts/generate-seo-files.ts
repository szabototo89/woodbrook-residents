import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  buildRobotsTxt,
  buildSitemapXml,
  collectSeoPaths,
  resolveSeoSiteUrl,
} from '../src/app/seoFiles';
import { formatErrorChain } from '../src/features/content/contentBuildDiagnostics';
import { loadContentSnapshot } from '../src/features/content/contentSnapshot';
import { createContentSource } from '../src/features/content/contentSourceFactory';
import { PRODUCTION_SITE_URL } from '../src/app/siteMetadata';

const appRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const outputRoot = path.join(appRoot, 'dist', 'client');

export function resolveSeoSiteUrlFromEnv(
  env: Record<string, string | undefined>,
): string {
  return resolveSeoSiteUrl(env['VITE_PUBLIC_SITE_URL'] ?? PRODUCTION_SITE_URL);
}

async function generateSeoFiles() {
  const siteUrl = resolveSeoSiteUrlFromEnv(process.env);
  console.log(`Generating SEO files for ${siteUrl}...`);

  const snapshot = await loadContentSnapshot(createContentSource());
  const paths = collectSeoPaths(snapshot);

  const sitemapXml = buildSitemapXml(paths, siteUrl);
  const robotsTxt = buildRobotsTxt(siteUrl);

  await Bun.write(path.join(outputRoot, 'sitemap.xml'), sitemapXml);
  await Bun.write(path.join(outputRoot, 'robots.txt'), robotsTxt);

  console.log(
    `Wrote sitemap.xml with ${paths.length} URLs and robots.txt with sitemap ${siteUrl}/sitemap.xml.`,
  );
}

try {
  await generateSeoFiles();
} catch (error) {
  console.error(formatErrorChain(error)[0]);
  process.exitCode = 1;
}
