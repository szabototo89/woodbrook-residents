export const PRODUCTION_SITE_URL = 'https://www.julietrosebeauty.com';
export const SITE_NAME = 'Juliet Rose Beauty Studio';

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
      ? `${SITE_NAME} | Relax and Revitalize`
      : `${input.title} | ${SITE_NAME}`;
  const canonicalUrl = new URL(input.path, `${siteUrl}/`).toString();

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
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: input.description },
    ],
    links: [{ rel: 'canonical', href: canonicalUrl }],
  };
}
