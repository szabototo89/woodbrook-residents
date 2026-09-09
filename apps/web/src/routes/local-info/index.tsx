import { createFileRoute } from '@tanstack/react-router';

import { createPageHead } from '../../app/siteMetadata';
import { getResources } from '../../features/content/contentApi';
import { LocalInfoPage } from '../../features/resources/LocalInfoPage';

export const Route = createFileRoute('/local-info/')({
  loader: () => getResources(),
  head: () =>
    createPageHead({
      title: 'Local information',
      description:
        'A curated directory of nearby public services, community contacts, and businesses for Woodbrook residents.',
      path: '/local-info',
    }),
  component: LocalInfoPage,
});
