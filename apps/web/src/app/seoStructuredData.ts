import { resolveSeoSiteUrl } from './seoFiles';
import { SITE_NAME } from './siteMetadata';

function toIsoDateTime(value: unknown): string | undefined {
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
  return parsed.toISOString();
}

function absoluteUrl(siteUrl: string, path: string): string {
  return new URL(path, `${resolveSeoSiteUrl(siteUrl)}/`).toString();
}

function resolveImageUrl(
  siteUrl: string,
  imagePath: unknown,
): string | undefined {
  if (typeof imagePath !== 'string') {
    return undefined;
  }
  const trimmed = imagePath.trim();
  if (!trimmed) {
    return undefined;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return undefined;
  } catch {
    if (trimmed.startsWith('/')) {
      return absoluteUrl(siteUrl, trimmed);
    }
    return undefined;
  }
}

function cleanText(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

type ArticleJsonLdInput = {
  siteUrl: string;
  path: string;
  headline: string;
  description: string;
  imagePath?: unknown;
  datePublished?: unknown;
  dateModified?: unknown;
};

export function createArticleJsonLd(input: ArticleJsonLdInput) {
  const origin = resolveSeoSiteUrl(input.siteUrl);
  const image = resolveImageUrl(input.siteUrl, input.imagePath);
  const datePublished = toIsoDateTime(input.datePublished);
  const dateModified = toIsoDateTime(input.dateModified);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: absoluteUrl(input.siteUrl, input.path),
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: `${origin}/`,
    },
    ...(image ? { image } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
  };
}

type EventJsonLdInput = {
  siteUrl: string;
  path: string;
  name: string;
  description: string;
  startDate: unknown;
  endDate?: unknown;
  locationName?: unknown;
  imagePath?: unknown;
};

export function createEventJsonLd(input: EventJsonLdInput) {
  const startDate = toIsoDateTime(input.startDate);
  const endDate = toIsoDateTime(input.endDate);
  const locationName = cleanText(input.locationName);
  const image = resolveImageUrl(input.siteUrl, input.imagePath);

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.siteUrl, input.path),
    eventStatus: 'https://schema.org/EventScheduled',
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
    ...(locationName
      ? { location: { '@type': 'Place', name: locationName } }
      : {}),
    ...(image ? { image } : {}),
  };
}
