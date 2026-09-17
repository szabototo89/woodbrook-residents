import { createWebsiteJsonLd } from './seoFiles';
import { resolveSiteUrl } from './siteMetadata';

export function SiteStructuredData() {
  const siteUrl = resolveSiteUrl(import.meta.env);
  const jsonLd = createWebsiteJsonLd(siteUrl);

  return (
    <script
      type="application/ld+json"
      data-testid="website-structured-data"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
