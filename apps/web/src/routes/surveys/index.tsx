import { createFileRoute } from '@tanstack/react-router';

import { getSurveys } from '../../features/content/contentApi';
import { SurveysPage } from '../../features/surveys/SurveysPage';

export const Route = createFileRoute('/surveys/')({
  loader: () => getSurveys(),
  component: SurveysPage,
});
