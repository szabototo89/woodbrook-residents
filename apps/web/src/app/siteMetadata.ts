const siteUrl = import.meta.env.VITE_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const socialImageUrl = new URL(
  '/images/woodbrook-residents-social-v3.png',
  siteUrl,
).toString();

type PageMetadata = {
  title: string;
  description: string;
  path: string;
};

export function createPageHead({ title, description, path }: PageMetadata) {
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
      { property: 'og:image', content: socialImageUrl },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: socialImageUrl },
    ],
    links: [{ rel: 'canonical', href: canonicalUrl }],
  };
}
