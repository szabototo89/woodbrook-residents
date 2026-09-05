import { createRootRoute } from '@tanstack/react-router';

import { NotFoundPage } from '../app/NotFoundPage';
import { RootDocument } from '../app/RootDocument';
import appCss from '../styles.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Woodbrook Community Hub | Shankill',
      },
      {
        name: 'description',
        content:
          'Updates, projects, events, local information, and ways to take action for residents of Woodbrook, Shankill.',
      },
      {
        property: 'og:title',
        content: 'Woodbrook Community Hub',
      },
      {
        property: 'og:description',
        content:
          'See what’s happening. Have your say. Help shape our neighbourhood.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  notFoundComponent: NotFoundPage,
  shellComponent: RootDocument,
});
