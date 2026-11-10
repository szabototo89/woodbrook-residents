export const PRODUCTION_SITE_URL = 'https://allthingsart.ie';
export const SITE_NAME = 'Laura Faichney All Things Art';
const SOCIAL_IMAGE_PATH = '/social/laura-faichney-share-v1.jpg';
const SOCIAL_IMAGE_ALT =
  'Laura Faichney All Things Art — Bold Art, Brighter Spaces, with a colourful painted portrait.';

export function resolveSiteUrl(env: Record<string, unknown>): string {
  const candidate = env['VITE_PUBLIC_SITE_URL'];
  if (typeof candidate !== 'string' || !candidate.trim()) {
    return PRODUCTION_SITE_URL;
  }

  try {
    const parsed = new URL(candidate.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
      ? parsed.toString().replace(/\/+$/, '')
      : PRODUCTION_SITE_URL;
  } catch {
    return PRODUCTION_SITE_URL;
  }
}

export function createPageHead(input: {
  title: string;
  description: string;
  path: string;
}) {
  const siteUrl = resolveSiteUrl(import.meta.env);
  const fullTitle =
    input.title === SITE_NAME
      ? 'Laura Faichney | All Things Art'
      : input.title.includes(SITE_NAME)
        ? input.title
        : `${input.title} | ${SITE_NAME}`;
  const canonicalUrl = new URL(input.path, `${siteUrl}/`).toString();
  const socialImageUrl = new URL(SOCIAL_IMAGE_PATH, `${siteUrl}/`).toString();

  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: input.description },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: input.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:locale', content: 'en_IE' },
      { property: 'og:image', content: socialImageUrl },
      { property: 'og:image:type', content: 'image/jpeg' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: SOCIAL_IMAGE_ALT },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: input.description },
      { name: 'twitter:image', content: socialImageUrl },
      { name: 'twitter:image:alt', content: SOCIAL_IMAGE_ALT },
    ],
    links: [{ rel: 'canonical', href: canonicalUrl }],
  };
}
