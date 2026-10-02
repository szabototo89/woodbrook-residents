import lauraContent from 'virtual:laura-content';
import { createFileRoute } from '@tanstack/react-router';
import { ServicesPage } from '../features/site/SitePages';
import { pageHeadFromSeo } from '../features/site/lauraSanity';

export const Route = createFileRoute('/services')({
  loader: () => lauraContent.services,
  head: ({ loaderData }) =>
    pageHeadFromSeo({
      seo: loaderData?.seo ?? {},
      fallbackTitle: 'Services',
      fallbackDescription:
        'From bespoke paintings to large-scale murals, facepainting and art tutoring, creative services for homes, businesses and events.',
      path: '/services',
    }),
  component: ServicesRoute,
});

function ServicesRoute() {
  const data = Route.useLoaderData();
  return <ServicesPage data={data} />;
}
