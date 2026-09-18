import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const outputRoot = path.join(appRoot, 'dist', 'client');

async function collectFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? collectFiles(entryPath) : [entryPath];
    }),
  );

  return files.flat();
}

async function fileExists(filePath: string) {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

async function pathExists(entryPath: string) {
  try {
    await stat(entryPath);
    return true;
  } catch {
    return false;
  }
}

function outputPathForUrl(pathname: string) {
  const decodedPath = decodeURIComponent(pathname);

  if (decodedPath === '/') {
    return path.join(outputRoot, 'index.html');
  }

  if (path.extname(decodedPath)) {
    return path.join(outputRoot, decodedPath);
  }

  return path.join(outputRoot, decodedPath, 'index.html');
}

const requiredPages = [
  '/',
  '/updates',
  '/events',
  '/projects',
  '/surveys',
  '/local-info',
  '/get-involved',
];

const missingRequiredPages = [];
for (const pathname of requiredPages) {
  if (!(await fileExists(outputPathForUrl(pathname)))) {
    missingRequiredPages.push(pathname);
  }
}

if (missingRequiredPages.length > 0) {
  throw new Error(
    `Static build is missing required pages: ${missingRequiredPages.join(', ')}`,
  );
}

const files = await collectFiles(outputRoot);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const missingLinks = new Set<string>();

for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, 'utf8');
  const links = html.matchAll(/\bhref=["']([^"']+)["']/g);
  const pagePath = path
    .relative(outputRoot, htmlFile)
    .split(path.sep)
    .join('/');
  const pageUrl = new URL(pagePath, 'https://static-build.local/');

  for (const [, href] of links) {
    if (!href) {
      continue;
    }
    const url = new URL(href, pageUrl);

    if (url.origin !== 'https://static-build.local') {
      continue;
    }

    if (!(await fileExists(outputPathForUrl(url.pathname)))) {
      missingLinks.add(url.pathname);
    }
  }
}

if (missingLinks.size > 0) {
  throw new Error(
    `Static build contains links without generated targets: ${[...missingLinks].join(', ')}`,
  );
}

const collectionSchedulePath = outputPathForUrl(
  '/local-info/thorntons-bin-collection-schedule-2026',
);
const collectionScheduleHtml = await readFile(collectionSchedulePath, 'utf8');
if (
  !collectionScheduleHtml.includes('Next collection dates') ||
  collectionScheduleHtml.includes('Checking the next collection dates') ||
  (!collectionScheduleHtml.includes('<time') &&
    !collectionScheduleHtml.includes('No remaining 2026 dates are listed'))
) {
  throw new Error(
    'Static build does not contain the resolved Thorntons collection schedule.',
  );
}

const cacheFiles = files.filter(
  (file) =>
    file.includes(
      `${path.sep}__tsr${path.sep}staticServerFnCache${path.sep}`,
    ) && file.endsWith('.json'),
);

if (cacheFiles.length === 0) {
  throw new Error('Static build did not emit any build-time CMS data.');
}

for (const cacheFile of cacheFiles) {
  JSON.parse(await readFile(cacheFile, 'utf8'));
}

const runtimeBackendPaths = ['_worker.js', '_routes.json', '_serverFn'];
for (const runtimePath of runtimeBackendPaths) {
  if (await pathExists(path.join(outputRoot, runtimePath))) {
    throw new Error(
      `Static build unexpectedly contains runtime backend output: ${runtimePath}`,
    );
  }
}

if (await fileExists(path.join(outputRoot, 'report', 'index.html'))) {
  throw new Error(
    'Static build unexpectedly contains the removed report form.',
  );
}

const robotsPath = path.join(outputRoot, 'robots.txt');
if (!(await fileExists(robotsPath))) {
  throw new Error('Static build is missing robots.txt for search indexing.');
}
const robotsTxt = await readFile(robotsPath, 'utf8');
if (!robotsTxt.includes('User-agent: *') || !robotsTxt.includes('Allow: /')) {
  throw new Error('Static build robots.txt must allow crawling.');
}
if (!robotsTxt.includes('Disallow: /concepts/')) {
  throw new Error('Static build robots.txt must disallow concept drafts.');
}
if (!robotsTxt.includes('/sitemap.xml')) {
  throw new Error(
    'Static build robots.txt must point crawlers at sitemap.xml.',
  );
}

const sitemapPath = path.join(outputRoot, 'sitemap.xml');
if (!(await fileExists(sitemapPath))) {
  throw new Error('Static build is missing sitemap.xml for search indexing.');
}
const sitemapXml = await readFile(sitemapPath, 'utf8');
if (
  !sitemapXml.includes('<urlset') ||
  !sitemapXml.includes('<loc>') ||
  !sitemapXml.includes('</urlset>')
) {
  throw new Error('Static build sitemap.xml is not a valid URL set.');
}
for (const pathname of requiredPages) {
  const absolute = `/${pathname.replace(/^\//, '')}`;
  const normalized = absolute === '/' ? '/' : absolute.replace(/\/$/, '');
  const candidates = [`${normalized === '/' ? '' : normalized}`, normalized];
  const found = candidates.some(
    (candidate) =>
      sitemapXml.includes(`<loc>`) &&
      (sitemapXml.includes(`${candidate}</loc>`) ||
        sitemapXml.includes(`${candidate}/</loc>`)),
  );
  if (!found && normalized !== '/') {
    throw new Error(
      `Static build sitemap.xml is missing required page: ${pathname}`,
    );
  }
}

console.log(
  `Verified ${htmlFiles.length} HTML files, ${cacheFiles.length} static CMS data files, and every generated internal link.`,
);
