import { createFileRoute, stripSearchParams } from '@tanstack/react-router';

import { createPageHead } from '../app/siteMetadata';
import { getSearchContent } from '../features/content/contentApi';
import { SearchPage } from '../features/search/SearchPage';
import { SearchPending } from '../features/search/SearchPending';
import { parseSearchParams } from '../features/search/searchModel';

export const Route = createFileRoute('/search')({
  validateSearch: parseSearchParams,
  search: { middlewares: [stripSearchParams({ q: '', category: 'all' })] },
  loader: () => getSearchContent(),
  head: () =>
    createPageHead({
      title: 'Search results',
      description:
        'Search Woodbrook community news, projects, events and local services.',
      path: '/search',
      robots: 'noindex',
    }),
  pendingComponent: SearchPending,
  component: SearchPage,
});
