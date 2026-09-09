import { createFileRoute } from '@tanstack/react-router';

import { createPageHead } from '../../app/siteMetadata';
import { getSurveyBySlug } from '../../features/content/contentApi';
import { SurveyDetailPage } from '../../features/surveys/SurveyDetailPage';

export const Route = createFileRoute('/surveys/$slug')({
  loader: ({ params }) => getSurveyBySlug({ data: { slug: params.slug } }),
  head: ({ loaderData, params }) =>
    createPageHead({
      title: loaderData?.title ?? 'Consultation unavailable',
      description:
        loaderData?.summary ??
        'This Woodbrook Residents consultation is unavailable.',
      path: `/surveys/${params.slug}`,
    }),
  component: SurveyDetailPage,
});
