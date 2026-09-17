export const PRODUCTION_SITE_URL = 'https://woodbrook.shankill.workers.dev';
export const SITE_NAME = 'Woodbrook Residents';
export const SITE_LOCALE = 'en_IE';
export const SOCIAL_IMAGE_PATH = '/images/woodbrook-residents-social-v3.png';

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

type PageMetadata = {
  title: string;
  description: string;
  path: string;
};

export function createPageHead({ title, description, path }: PageMetadata) {
  const siteUrl = getSiteUrl();
  const socialImageUrl = getSocialImageUrl(siteUrl);
  const fullTitle =
    title === 'Woodbrook Residents'
      ? 'Woodbrook Residents | Shankill'
      : `${title} | Woodbrook Residents`;
  const canonicalUrl = new URL(path, `${siteUrl}/`).toString();

  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: description },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:locale', content: SITE_LOCALE },
      { property: 'og:image', content: socialImageUrl },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: fullTitle },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: socialImageUrl },
      { name: 'twitter:image:alt', content: fullTitle },
    ],
    links: [{ rel: 'canonical', href: canonicalUrl }],
  };
}
