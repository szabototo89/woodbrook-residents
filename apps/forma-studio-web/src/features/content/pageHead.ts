import type { FormaContent } from './schema';
export function pageHead(seo: FormaContent['home']['seo']) {
  return {
    meta: [
      { title: seo.title },
      { name: 'description', content: seo.description },
      { property: 'og:title', content: seo.title },
      { property: 'og:description', content: seo.socialDescription },
      { property: 'og:type', content: 'website' },
    ],
  };
}
