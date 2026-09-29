import { createFileRoute } from '@tanstack/react-router';
import { createPageHead } from '../app/siteMetadata';
import { ServicesPage } from '../features/site/SitePages';

export const Route = createFileRoute('/services')({
  head: () =>
    createPageHead({
      title: 'Services',
      description:
        'From bespoke paintings to large-scale murals, facepainting and art tutoring, creative services for homes, businesses and events.',
      path: '/services',
    }),
  component: ServicesPage,
});
