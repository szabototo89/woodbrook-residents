import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '../features/site/SitePages';
import { pageHeadFromSeo } from '../features/site/lauraSanity';
import { serviceDiscoveryCopy } from '../features/site/serviceDiscoveryCopy';

export const Route = createFileRoute('/')({
  loader: async () => (await import('virtual:laura-content')).default.home,
  head: ({ loaderData }) =>
    pageHeadFromSeo({
      seo: loaderData?.seo ?? {},
      fallbackTitle: serviceDiscoveryCopy.home.title,
      fallbackDescription: serviceDiscoveryCopy.home.description,
      path: '/',
    }),
  component: HomeRoute,
});

function HomeRoute() {
  const data = Route.useLoaderData();
  return <HomePage data={data} />;
}
