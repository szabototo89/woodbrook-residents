import { createFileRoute } from '@tanstack/react-router';
import { ServicesPage } from '../features/site/SitePages';
import { pageHeadFromSeo } from '../features/site/lauraSanity';
import { serviceDiscoveryCopy } from '../features/site/serviceDiscoveryCopy';

export const Route = createFileRoute('/services')({
  loader: async () => (await import('virtual:laura-content')).default.services,
  head: ({ loaderData }) =>
    pageHeadFromSeo({
      seo: loaderData?.seo ?? {},
      fallbackTitle: serviceDiscoveryCopy.services.title,
      fallbackDescription: serviceDiscoveryCopy.services.description,
      path: '/services',
    }),
  component: ServicesRoute,
});

function ServicesRoute() {
  const data = Route.useLoaderData();
  return <ServicesPage data={data} />;
}
