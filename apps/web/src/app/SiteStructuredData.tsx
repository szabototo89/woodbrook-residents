import { createSiteJsonLdGraph } from './seoFiles';
import { resolveSiteUrl } from './siteMetadata';

export function SiteStructuredData() {
  const siteUrl = resolveSiteUrl(import.meta.env);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': createSiteJsonLdGraph(siteUrl),
  };

  return (
    <script
      type="application/ld+json"
      data-testid="website-structured-data"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
