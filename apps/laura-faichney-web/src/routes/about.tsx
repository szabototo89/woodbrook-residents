import { createFileRoute } from '@tanstack/react-router';
import { AboutPage } from '../features/site/SitePages';

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [{ title: 'About Laura | Laura Faichney All Things Art' }],
  }),
  component: AboutPage,
});
