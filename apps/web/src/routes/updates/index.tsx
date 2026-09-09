import { createFileRoute } from '@tanstack/react-router';

import { createPageHead } from '../../app/siteMetadata';
import { getUpdates } from '../../features/content/contentApi';
import { UpdatesPage } from '../../features/updates/UpdatesPage';

export const Route = createFileRoute('/updates/')({
  loader: () => getUpdates(),
  head: () =>
    createPageHead({
      title: 'Updates',
      description:
        'Source-linked updates on transport, planning, public spaces, and practical changes affecting Woodbrook residents.',
      path: '/updates',
    }),
  component: UpdatesPage,
});
