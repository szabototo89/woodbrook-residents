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

type BreadcrumbItem = {
  name: string;
  path: string;
};

export function createBreadcrumbJsonLd(input: {
  siteUrl: string;
  items: BreadcrumbItem[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: input.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(input.siteUrl, item.path),
    })),
  };
}

type ProjectJsonLdInput = {
  siteUrl: string;
  path: string;
  headline: string;
  description: string;
  imagePath?: unknown;
  dateModified?: unknown;
};

export function createProjectJsonLd(input: ProjectJsonLdInput) {
  const origin = resolveSeoSiteUrl(input.siteUrl);
  const image = resolveImageUrl(input.siteUrl, input.imagePath);
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
    ...(dateModified ? { dateModified } : {}),
  };
}

type SurveyJsonLdInput = {
  siteUrl: string;
  path: string;
  headline: string;
  description: string;
  imagePath?: unknown;
  datePublished?: unknown;
  dateModified?: unknown;
};

export function createSurveyJsonLd(input: SurveyJsonLdInput) {
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

type LocalServiceJsonLdInput = {
  siteUrl: string;
  path: string;
  name: string;
  description: string;
  phone?: unknown;
  address?: unknown;
  url?: unknown;
};

export function createLocalServiceJsonLd(input: LocalServiceJsonLdInput) {
  const phone = cleanText(input.phone);
  const address = cleanText(input.address);
  const providerUrl = cleanText(input.url);

  return {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOffice',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.siteUrl, input.path),
    ...(phone ? { telephone: phone } : {}),
    ...(address
      ? { address: { '@type': 'PostalAddress', streetAddress: address } }
      : {}),
    ...(providerUrl ? { sameAs: providerUrl } : {}),
  };
}

function ensurePeriod(text: string): string {
  return text.endsWith('.') ? text : `${text}.`;
}

export function composeLocalInfoDescription(input: {
  description: string;
  phone?: unknown;
  address?: unknown;
}): string {
  const base = ensurePeriod(input.description.trim());
  const phone = cleanText(input.phone);
  const address = cleanText(input.address);
  const parts = [base];
  if (phone) {
    parts.push(`Call ${ensurePeriod(phone)}`);
  }
  if (address && !base.includes(address)) {
    parts.push(`Visit ${ensurePeriod(address)}`);
  }
  const composed = parts.join(' ').replace(/\s+/g, ' ').trim();
  if (composed.length > 155) {
    return `${composed.slice(0, 152).trimEnd()}...`;
  }
  return composed;
}
