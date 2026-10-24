import {
  createFileRoute,
  type SearchSchemaInput,
} from '@tanstack/react-router';

import { createPageHead } from '../../app/siteMetadata';
import { getUpdates } from '../../features/content/contentApi';
import { parseNewsParams } from '../../features/updates/newsFilters';
import { UpdatesPage } from '../../features/updates/UpdatesPage';

export const Route = createFileRoute('/updates/')({
  validateSearch: (search: Record<string, unknown> & SearchSchemaInput) =>
    parseNewsParams(search),
  loader: () => getUpdates(),
  head: () =>
    createPageHead({
      title: 'News',
      description:
        'Source-linked news on transport, planning, public spaces, and practical changes affecting Woodbrook residents.',
      path: '/updates',
    }),
  component: UpdatesPage,
});
