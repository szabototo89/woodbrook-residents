import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  LauraSanitySource,
  galleryPhotoPath,
} from '../src/features/site/lauraSanity';

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

const gallery = await new LauraSanitySource().loadGallery();
const requiredPages = [
  '/',
  '/services',
  '/gallery',
  '/about',
  '/contact',
  ...gallery.items.map(galleryPhotoPath),
];

const requiredPageChecks = await Promise.all(
  requiredPages.map(async (pathname) => ({
    pathname,
    exists: await fileExists(outputPathForUrl(pathname)),
  })),
);
const missingRequiredPages = requiredPageChecks
  .filter((check) => !check.exists)
  .map((check) => check.pathname);

if (missingRequiredPages.length > 0) {
  throw new Error(
    `Static build is missing required pages: ${missingRequiredPages.join(', ')}`,
  );
}

const files = await collectFiles(outputRoot);
const htmlFiles = files.filter((file) => file.endsWith('.html'));

async function missingLinksIn(htmlFile: string): Promise<string[]> {
  const html = await readFile(htmlFile, 'utf8');
  const links = [...html.matchAll(/\bhref=["']([^"']+)["']/g)];
  const pagePath = path
    .relative(outputRoot, htmlFile)
    .split(path.sep)
    .join('/');
  const pageUrl = new URL(pagePath, 'https://static-build.local/');

  const checks = await Promise.all(
    links.map(async ([, href]) => {
      if (!href) {
        return undefined;
      }
      const url = new URL(href, pageUrl);

      if (url.origin !== 'https://static-build.local') {
        return undefined;
      }

      if (await fileExists(outputPathForUrl(url.pathname))) {
        return undefined;
      }
      return url.pathname;
    }),
  );

  return checks.filter(
    (pathname): pathname is string => pathname !== undefined,
  );
}

const missingLinks = new Set(
  (await Promise.all(htmlFiles.map(missingLinksIn))).flat(),
);

if (missingLinks.size > 0) {
  throw new Error(
    `Static build contains links without generated targets: ${[...missingLinks].join(', ')}`,
  );
}

const runtimeBackendPaths = ['_worker.js', '_routes.json', '_serverFn'];
const backendChecks = await Promise.all(
  runtimeBackendPaths.map(async (runtimePath) => ({
    runtimePath,
    exists: await pathExists(path.join(outputRoot, runtimePath)),
  })),
);
const unexpectedBackend = backendChecks.find((check) => check.exists);

if (unexpectedBackend) {
  throw new Error(
    `Static build unexpectedly contains runtime backend output: ${unexpectedBackend.runtimePath}`,
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
const missingSitemapPage = requiredPages.find((pathname) => {
  const absolute = `/${pathname.replace(/^\//, '')}`;
  const normalized = absolute === '/' ? '/' : absolute.replace(/\/$/, '');
  const candidates = [`${normalized === '/' ? '' : normalized}`, normalized];
  const found = candidates.some(
    (candidate) =>
      sitemapXml.includes(`<loc>`) &&
      (sitemapXml.includes(`${candidate}</loc>`) ||
        sitemapXml.includes(`${candidate}/</loc>`)),
  );
  return !found && normalized !== '/';
});

if (missingSitemapPage) {
  throw new Error(
    `Static build sitemap.xml is missing required page: ${missingSitemapPage}`,
  );
}

const sitemapLocs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => {
    const loc = match[1];
    if (!loc) {
      return undefined;
    }
    try {
      return new URL(loc).pathname;
    } catch {
      return undefined;
    }
  })
  .filter(
    (pathname): pathname is string =>
      typeof pathname === 'string' && !pathname.startsWith('/documents/'),
  );

const sitemapTargetChecks = await Promise.all(
  sitemapLocs.map(async (pathname) => ({
    pathname,
    exists: await fileExists(outputPathForUrl(pathname)),
  })),
);
const missingSitemapTargets = sitemapTargetChecks
  .filter((check) => !check.exists)
  .map((check) => check.pathname);

if (missingSitemapTargets.length > 0) {
  throw new Error(
    `Static build is missing prerendered pages for sitemap URLs: ${missingSitemapTargets.join(', ')}`,
  );
}

console.log(
  `Verified ${htmlFiles.length} HTML files and every generated internal link.`,
);
