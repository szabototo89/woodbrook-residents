import { createFileRoute } from '@tanstack/react-router';

import { createPageHead } from '../../app/siteMetadata';
import { getResources } from '../../features/content/contentApi';
import { getDublinCalendarDate } from '../../features/resources/collectionScheduleUtils';
import { LocalInfoPage } from '../../features/resources/LocalInfoPage';

type LocalInfoSearch = {
  q?: string;
  category?: string;
  ooh?: '1';
};

export const Route = createFileRoute('/local-info/')({
  validateSearch: (search: Record<string, unknown>): LocalInfoSearch => ({
    q: typeof search.q === 'string' ? search.q.slice(0, 120) : undefined,
    category: typeof search.category === 'string' ? search.category : undefined,
    ooh: search.ooh === '1' ? ('1' as const) : undefined,
  }),
  loaderDeps: ({ search }) => ({
    q: search.q,
    category: search.category,
    ooh: search.ooh,
  }),
  loader: async () => ({
    content: await getResources(),
    today: getDublinCalendarDate(),
  }),
  head: () =>
    createPageHead({
      title: 'Local information',
      description:
        'A curated directory of nearby public services, community contacts, and businesses for Woodbrook residents.',
      path: '/local-info',
    }),
  component: LocalInfoPage,
});
