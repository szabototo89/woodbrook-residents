import { createFileRoute } from '@tanstack/react-router';
import { createPageHead } from '../app/siteMetadata';
import { getSearchContent } from '../features/content/contentApi';
import { SearchPage } from '../features/search/SearchPage';
import { parseSearchQuery } from '../features/search/siteSearch';

export const Route = createFileRoute('/search')({
  validateSearch: (search: Record<string, unknown>) => ({
    q: parseSearchQuery(search.q),
  }),
  loader: () => getSearchContent(),
  head: () =>
    createPageHead({
      title: 'Search',
      description:
        'Search published Woodbrook updates, events, projects, consultations and local services.',
      path: '/search',
    }),
  component: SearchPage,
});
