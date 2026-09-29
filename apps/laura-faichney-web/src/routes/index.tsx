import { createFileRoute } from '@tanstack/react-router';
import { createPageHead, SITE_NAME } from '../app/siteMetadata';
import { HomePage } from '../features/site/SitePages';

export const Route = createFileRoute('/')({
  head: () =>
    createPageHead({
      title: SITE_NAME,
      description:
        'Colourful paintings, murals, signage, facepainting and art tutoring by Laura Faichney.',
      path: '/',
    }),
  component: HomePage,
});
