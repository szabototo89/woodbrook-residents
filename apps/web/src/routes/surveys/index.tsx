import { createFileRoute } from '@tanstack/react-router';

import { createPageHead } from '../../app/siteMetadata';
import { getSurveys } from '../../features/content/contentApi';
import { SurveysPage } from '../../features/surveys/SurveysPage';

export const Route = createFileRoute('/surveys/')({
  loader: () => getSurveys(),
  head: () =>
    createPageHead({
      title: 'Consultations',
      description:
        'Current opportunities to respond and an archive of public consultations relevant to Woodbrook residents.',
      path: '/surveys',
    }),
  component: SurveysPage,
});
