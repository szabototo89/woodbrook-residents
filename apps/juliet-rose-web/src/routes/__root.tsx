import { createRootRoute } from '@tanstack/react-router';

import { NotFoundPage } from '../app/NotFoundPage';
import { RootDocument } from '../app/RootDocument';

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
        name: 'theme-color',
        content: '#fbf8f4',
      },
    ],
    links: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
  }),
  notFoundComponent: NotFoundPage,
  shellComponent: RootDocument,
});
