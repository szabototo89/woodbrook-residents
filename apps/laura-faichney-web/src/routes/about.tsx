import { createFileRoute } from '@tanstack/react-router';
import { createPageHead } from '../app/siteMetadata';
import { AboutPage } from '../features/site/SitePages';

export const Route = createFileRoute('/about')({
  head: () =>
    createPageHead({
      title: 'About Laura',
      description:
        'Laura Faichney is an artist in Ireland creating colourful paintings, murals and bespoke pieces for homes, businesses and events.',
      path: '/about',
    }),
  component: AboutPage,
});
