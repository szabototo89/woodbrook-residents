import lauraContent from 'virtual:laura-content';
import { createFileRoute } from '@tanstack/react-router';
import { createPageHead } from '../app/siteMetadata';
import { ContactPage } from '../features/site/SitePages';

export const Route = createFileRoute('/contact')({
  validateSearch: (search: Record<string, unknown>) => ({
    service: typeof search.service === 'string' ? search.service : undefined,
  }),
  loader: () => lauraContent.services,
  head: () =>
    createPageHead({
      title: 'Contact',
      description:
        'Contact Laura Faichney about a commissioned painting, mural, event or creative session.',
      path: '/contact',
    }),
  component: ContactRoute,
});

function ContactRoute() {
  const { settings, services } = Route.useLoaderData();
  const { service } = Route.useSearch();
  return (
    <ContactPage
      settings={settings}
      services={services}
      selectedService={service}
    />
  );
}
