import { createFileRoute } from '@tanstack/react-router';

import {
  createBreadcrumbJsonLd,
  createSurveyJsonLd,
} from '../../app/seoStructuredData';
import { createPageHead, resolveSiteUrl } from '../../app/siteMetadata';
import { getSurveyBySlug } from '../../features/content/contentApi';
import { SurveyDetailPage } from '../../features/surveys/SurveyDetailPage';

export const Route = createFileRoute('/surveys/$slug')({
  loader: ({ params }) => getSurveyBySlug({ data: { slug: params.slug } }),
  head: ({ loaderData, params }) => {
    const path = `/surveys/${params.slug}`;
    if (!loaderData) {
      return createPageHead({
        title: 'Consultation unavailable',
        description: 'This Woodbrook Residents consultation is unavailable.',
        path,
        robots: 'noindex',
      });
    }
    const siteUrl = resolveSiteUrl(import.meta.env);
    return createPageHead({
      title: loaderData.title,
      description: loaderData.summary,
      path,
      jsonLd: [
        createBreadcrumbJsonLd({
          siteUrl,
          items: [
            { name: 'Home', path: '/' },
            { name: 'Consultations', path: '/surveys' },
            { name: loaderData.title, path },
          ],
        }),
        createSurveyJsonLd({
          siteUrl,
          path,
          headline: loaderData.title,
          description: loaderData.summary,
          datePublished: loaderData.opensOn,
          dateModified: loaderData.closesOn ?? loaderData.sourceReviewedOn,
        }),
      ],
    });
  },
  component: SurveyDetailPage,
});
