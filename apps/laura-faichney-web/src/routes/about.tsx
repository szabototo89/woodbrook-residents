import { createFileRoute } from '@tanstack/react-router';
import { AboutPage } from '../features/site/SitePages';
import { pageHeadFromSeo } from '../features/site/lauraSanity';

export const Route = createFileRoute('/about')({
  loader: async () => (await import('virtual:laura-content')).default.about,
  head: ({ loaderData }) =>
    pageHeadFromSeo({
      seo: loaderData?.seo ?? {},
      fallbackTitle: 'About Laura',
      fallbackDescription:
        'Laura Faichney is an artist in Ireland creating colourful paintings, murals and bespoke pieces for homes, businesses and events.',
      path: '/about',
    }),
  component: AboutRoute,
});

function AboutRoute() {
  const data = Route.useLoaderData();
  return <AboutPage data={data} />;
}
