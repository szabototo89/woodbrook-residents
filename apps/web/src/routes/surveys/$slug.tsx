import { createFileRoute } from '@tanstack/react-router';

import { getSurveyBySlug } from '../../features/content/contentApi';
import { SurveyDetailPage } from '../../features/surveys/SurveyDetailPage';

export const Route = createFileRoute('/surveys/$slug')({
  loader: ({ params }) => getSurveyBySlug({ data: { slug: params.slug } }),
  component: SurveyDetailPage,
});
