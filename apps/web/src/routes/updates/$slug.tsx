import { createFileRoute } from '@tanstack/react-router';

import { createArticleJsonLd } from '../../app/seoStructuredData';
import { createPageHead, resolveSiteUrl } from '../../app/siteMetadata';
import { getUpdateBySlug } from '../../features/content/contentApi';
import { UpdateDetailPage } from '../../features/updates/UpdateDetailPage';

export const Route = createFileRoute('/updates/$slug')({
  loader: ({ params }) => getUpdateBySlug({ data: { slug: params.slug } }),
  head: ({ loaderData, params }) => {
    const path = `/updates/${params.slug}`;
    if (!loaderData) {
      return createPageHead({
        title: 'Update unavailable',
        description: 'This Woodbrook Residents update is unavailable.',
        path,
      });
    }
    const siteUrl = resolveSiteUrl(import.meta.env);
    return createPageHead({
      title: loaderData.title,
      description: loaderData.summary,
      path,
      ogType: 'article',
      publishedTime: loaderData.publishedOn,
      modifiedTime: loaderData.sourceReviewedOn,
      jsonLd: createArticleJsonLd({
        siteUrl,
        path,
        headline: loaderData.title,
        description: loaderData.summary,
        imagePath: loaderData.imagePath,
        datePublished: loaderData.publishedOn,
        dateModified: loaderData.sourceReviewedOn,
      }),
    });
  },
  component: UpdateDetailPage,
});
