import { createFileRoute } from '@tanstack/react-router';
import { ServicesPage } from '../features/site/SitePages';

export const Route = createFileRoute('/services')({
  head: () => ({
    meta: [{ title: 'Services | Laura Faichney All Things Art' }],
  }),
  component: ServicesPage,
});
