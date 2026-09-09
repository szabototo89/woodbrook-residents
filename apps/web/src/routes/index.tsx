import { createFileRoute } from '@tanstack/react-router';

import { createPageHead } from '../app/siteMetadata';
import { getHomeContent } from '../features/content/contentApi';
import { HomePage } from '../features/home/HomePage';

export const Route = createFileRoute('/')({
  loader: () => getHomeContent(),
  head: () =>
    createPageHead({
      title: 'Woodbrook Residents',
      description:
        'Local updates, services, events, projects, and public consultations for Woodbrook residents in Shankill.',
      path: '/',
    }),
  component: HomePage,
});
