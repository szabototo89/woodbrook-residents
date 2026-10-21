import { createRootRoute, retainSearchParams } from '@tanstack/react-router';

import { NotFoundPage } from '../app/NotFoundPage';
import { RootDocument } from '../app/RootDocument';
import appCss from '../styles.css?url';
import themeCss from '../components/site-theme.css?url';
import authCss from '../features/auth/auth.css?url';
import homeCss from '../features/home/home.css?url';

export const Route = createRootRoute({
  validateSearch: (
    search: Record<string, unknown>,
  ): { feature_flag?: string } => ({
    ...(typeof search.feature_flag === 'string' ||
    (Array.isArray(search.feature_flag) &&
      search.feature_flag.every((flag) => typeof flag === 'string'))
      ? {
          feature_flag: Array.isArray(search.feature_flag)
            ? search.feature_flag.join(',')
            : search.feature_flag,
        }
      : {}),
  }),
  search: { middlewares: [retainSearchParams(['feature_flag'])] },
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
        content: '#416b58',
      },
    ],
    links: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon.svg',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '48x48',
        href: '/favicon-48.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
      { rel: 'stylesheet', href: themeCss },
      { rel: 'stylesheet', href: homeCss },
      { rel: 'stylesheet', href: authCss },
    ],
  }),
  notFoundComponent: NotFoundPage,
  shellComponent: RootDocument,
});
