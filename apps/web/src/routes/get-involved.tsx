import { createFileRoute } from '@tanstack/react-router';

import { createPageHead } from '../app/siteMetadata';
import { getSiteSetting } from '../features/content/contentApi';
import { GetInvolvedPage } from '../features/involvement/GetInvolvedPage';

export const Route = createFileRoute('/get-involved')({
  loader: () => getSiteSetting(),
  head: () =>
    createPageHead({
      title: 'Ways to help',
      description:
        'Find out how to check local information, suggest corrections, and follow community activity through Woodbrook Residents.',
      path: '/get-involved',
    }),
  component: GetInvolvedPage,
});
