import { createRootRoute } from '@tanstack/react-router';

import { NotFoundPage } from '../app/NotFoundPage';
import { RootDocument } from '../app/RootDocument';
import appCss from '../styles.css?url';

const siteUrl = import.meta.env.VITE_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const socialImageUrl = `${siteUrl}/images/woodbrook-community-hub-social.png`;

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
        content: '#145e63',
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
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:image',
        content: socialImageUrl,
      },
      {
        property: 'og:image:width',
        content: '1200',
      },
      {
        property: 'og:image:height',
        content: '630',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:image',
        content: socialImageUrl,
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: siteUrl,
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  notFoundComponent: NotFoundPage,
  shellComponent: RootDocument,
});
