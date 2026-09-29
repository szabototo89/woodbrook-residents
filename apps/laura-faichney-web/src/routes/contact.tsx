import { createFileRoute } from '@tanstack/react-router';
import { createPageHead } from '../app/siteMetadata';
import { ContactPage } from '../features/site/SitePages';

export const Route = createFileRoute('/contact')({
  head: () =>
    createPageHead({
      title: 'Contact',
      description:
        'Contact Laura Faichney about a commissioned painting, mural, event or creative session.',
      path: '/contact',
    }),
  component: ContactPage,
});
