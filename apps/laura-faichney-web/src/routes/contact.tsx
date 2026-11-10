import { createFileRoute } from '@tanstack/react-router';
import { createPageHead } from '../app/siteMetadata';
import { ContactPage } from '../features/site/SitePages';
import { serviceDiscoveryCopy } from '../features/site/serviceDiscoveryCopy';

export const Route = createFileRoute('/contact')({
  validateSearch: (search: Record<string, unknown>) => ({
    service: typeof search.service === 'string' ? search.service : undefined,
  }),
  loader: async () => (await import('virtual:laura-content')).default.services,
  head: () =>
    createPageHead({
      title: serviceDiscoveryCopy.contact.title,
      description: serviceDiscoveryCopy.contact.description,
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
