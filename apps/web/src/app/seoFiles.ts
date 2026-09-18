import type { ContentSnapshot } from '../features/content/contentTypes';
import {
  ORGANIZATION_LOGO_PATH,
  PRODUCTION_SITE_URL,
  SITE_ALTERNATE_NAME,
  SITE_NAME,
} from './siteMetadata';

export type SeoPath = {
  path: string;
  lastmod?: string;
};

export const STATIC_SEO_ROUTES: string[] = [
  '/',
  '/updates',
  '/events',
  '/projects',
  '/surveys',
  '/local-info',
  '/get-involved',
];

export const STATIC_SEO_DOCUMENTS: string[] = [
  '/documents/thorntons-bin-collection-schedule-2026.pdf',
];

function cleanSlug(slug: unknown): string | undefined {
  if (typeof slug !== 'string') {
    return undefined;
  }
  const trimmed = slug.trim();
  return trimmed ? trimmed : undefined;
}

function dateOnly(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }
  return parsed.toISOString().slice(0, 10);
}

export function collectSeoPaths(snapshot: ContentSnapshot): SeoPath[] {
  const staticPaths: SeoPath[] = [
    ...STATIC_SEO_ROUTES.map((route) => ({ path: route })),
    ...STATIC_SEO_DOCUMENTS.map((documentPath) => ({
      path: documentPath,
    })),
  ];

  const updatePaths: SeoPath[] = snapshot.updates
    .map((update) => ({
      slug: cleanSlug(update.slug),
      lastmod: dateOnly(update.publishedOn),
    }))
    .filter(
      (entry): entry is { slug: string; lastmod: string | undefined } =>
        entry.slug !== undefined,
    )
    .map((entry) =>
      entry.lastmod
        ? { path: `/updates/${entry.slug}`, lastmod: entry.lastmod }
        : { path: `/updates/${entry.slug}` },
    );

  const projectPaths: SeoPath[] = snapshot.projects
    .map((project) => ({
      slug: cleanSlug(project.slug),
      lastmod: dateOnly(project.updatedOn),
    }))
    .filter(
      (entry): entry is { slug: string; lastmod: string | undefined } =>
        entry.slug !== undefined,
    )
    .map((entry) =>
      entry.lastmod
        ? { path: `/projects/${entry.slug}`, lastmod: entry.lastmod }
        : { path: `/projects/${entry.slug}` },
    );

  const eventPaths: SeoPath[] = snapshot.events
    .map((event) => ({
      slug: cleanSlug(event.slug),
      lastmod: dateOnly(event.startsAt),
    }))
    .filter(
      (entry): entry is { slug: string; lastmod: string | undefined } =>
        entry.slug !== undefined,
    )
    .map((entry) =>
      entry.lastmod
        ? { path: `/events/${entry.slug}`, lastmod: entry.lastmod }
        : { path: `/events/${entry.slug}` },
    );

  const surveyPaths: SeoPath[] = snapshot.surveys
    .map((survey) => ({
      slug: cleanSlug(survey.slug),
      lastmod: dateOnly(survey.closesOn) ?? dateOnly(survey.opensOn),
    }))
    .filter(
      (entry): entry is { slug: string; lastmod: string | undefined } =>
        entry.slug !== undefined,
    )
    .map((entry) =>
      entry.lastmod
        ? { path: `/surveys/${entry.slug}`, lastmod: entry.lastmod }
        : { path: `/surveys/${entry.slug}` },
    );

  const resourcePaths: SeoPath[] = snapshot.resources
    .map((resource) => ({
      slug: cleanSlug(resource.slug),
      lastmod: dateOnly(resource.sourceReviewedOn),
    }))
    .filter(
      (entry): entry is { slug: string; lastmod: string | undefined } =>
        entry.slug !== undefined,
    )
    .map((entry) =>
      entry.lastmod
        ? { path: `/local-info/${entry.slug}`, lastmod: entry.lastmod }
        : { path: `/local-info/${entry.slug}` },
    );

  const combined = [
    ...staticPaths,
    ...updatePaths,
    ...projectPaths,
    ...eventPaths,
    ...surveyPaths,
    ...resourcePaths,
  ];

  const seen = new Map<string, SeoPath>();
  combined
    .filter((entry) => !seen.has(entry.path))
    .map((entry) => {
      seen.set(entry.path, entry);
      return entry;
    });

  return [...seen.values()].sort((a, b) => a.path.localeCompare(b.path));
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function resolveSeoSiteUrl(value: unknown): string {
  if (typeof value !== 'string') {
    return PRODUCTION_SITE_URL;
  }
  const trimmed = value.trim().replace(/\/+$/, '');
  if (!trimmed) {
    return PRODUCTION_SITE_URL;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return PRODUCTION_SITE_URL;
    }
    return parsed.toString().replace(/\/+$/, '');
  } catch {
    return PRODUCTION_SITE_URL;
  }
}

export function buildSitemapXml(paths: SeoPath[], siteUrl: string): string {
  const origin = resolveSeoSiteUrl(siteUrl);
  const urls = paths
    .map(({ path, lastmod }) => {
      const loc = escapeXml(new URL(path, `${origin}/`).toString());
      const lastmodTag = lastmod
        ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>`
        : '';
      return `  <url>\n    <loc>${loc}</loc>${lastmodTag}\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function buildRobotsTxt(siteUrl: string): string {
  const origin = resolveSeoSiteUrl(siteUrl);
  return `User-agent: *\nAllow: /\nDisallow: /concepts/\nSitemap: ${origin}/sitemap.xml\n`;
}

export function createWebsiteJsonLd(siteUrl: string) {
  const origin = resolveSeoSiteUrl(siteUrl);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAME,
    url: `${origin}/`,
    inLanguage: 'en-IE',
    description:
      'Local updates, services, events, projects, and public consultations for Woodbrook residents in Shankill.',
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: `${origin}/`,
    },
  };
}

export function createOrganizationJsonLd(siteUrl: string) {
  const origin = resolveSeoSiteUrl(siteUrl);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAME,
    url: `${origin}/`,
    logo: new URL(ORGANIZATION_LOGO_PATH, `${origin}/`).toString(),
  };
}

export function createSiteJsonLdGraph(siteUrl: string) {
  return [createWebsiteJsonLd(siteUrl), createOrganizationJsonLd(siteUrl)];
}
