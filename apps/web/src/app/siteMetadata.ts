export const PRODUCTION_SITE_URL = 'https://woodbrook.shankill.workers.dev';
export const SITE_NAME = 'Woodbrook Residents';
export const SITE_ALTERNATE_NAME = 'Woodbrook Residents Shankill';
export const SITE_LOCALE = 'en_IE';
export const SOCIAL_IMAGE_PATH = '/images/woodbrook-residents-social-v3.png';
export const FAVICON_PNG_PATH = '/favicon-48.png';
export const APPLE_TOUCH_ICON_PATH = '/apple-touch-icon.png';
export const ORGANIZATION_LOGO_PATH = APPLE_TOUCH_ICON_PATH;

export function resolveSiteUrl(env: Record<string, unknown>): string {
  const raw = env['VITE_PUBLIC_SITE_URL'];
  if (typeof raw !== 'string') {
    return PRODUCTION_SITE_URL;
  }
  const trimmed = raw.trim().replace(/\/+$/, '');
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

function getSiteUrl(): string {
  return resolveSiteUrl(import.meta.env);
}

function getSocialImageUrl(siteUrl: string): string {
  return new URL(SOCIAL_IMAGE_PATH, `${siteUrl}/`).toString();
}

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

type PageMetadata = {
  title: string;
  description: string;
  path: string;
  ogType?: 'website' | 'article';
  publishedTime?: unknown;
  modifiedTime?: unknown;
  jsonLd?: unknown;
};

export function createPageHead({
  title,
  description,
  path,
  ogType,
  publishedTime,
  modifiedTime,
  jsonLd,
}: PageMetadata) {
  const siteUrl = getSiteUrl();
  const socialImageUrl = getSocialImageUrl(siteUrl);
  const fullTitle =
    title === 'Woodbrook Residents'
      ? 'Woodbrook Residents | Shankill'
      : `${title} | Woodbrook Residents`;
  const canonicalUrl = new URL(path, `${siteUrl}/`).toString();
  const resolvedOgType = ogType ?? 'website';
  const publishedIso =
    resolvedOgType === 'article' ? toIsoDateTime(publishedTime) : undefined;
  const modifiedIso =
    resolvedOgType === 'article' ? toIsoDateTime(modifiedTime) : undefined;

  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: description },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:type', content: resolvedOgType },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:locale', content: SITE_LOCALE },
      { property: 'og:image', content: socialImageUrl },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: fullTitle },
      ...(publishedIso
        ? [{ property: 'article:published_time', content: publishedIso }]
        : []),
      ...(modifiedIso
        ? [{ property: 'article:modified_time', content: modifiedIso }]
        : []),
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: socialImageUrl },
      { name: 'twitter:image:alt', content: fullTitle },
    ],
    links: [{ rel: 'canonical', href: canonicalUrl }],
    scripts:
      jsonLd === undefined || jsonLd === null
        ? []
        : [{ type: 'application/ld+json', children: JSON.stringify(jsonLd) }],
  };
}
