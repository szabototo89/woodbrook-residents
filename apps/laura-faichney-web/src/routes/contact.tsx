import { createFileRoute } from '@tanstack/react-router';
import { ContactPage } from '../features/site/SitePages';

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: [{ title: 'Contact | Laura Faichney All Things Art' }],
  }),
  component: ContactPage,
});
