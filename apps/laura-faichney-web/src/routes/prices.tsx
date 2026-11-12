import { createFileRoute } from '@tanstack/react-router';
import { PricesPage } from '../features/site/PricesPage';
import { pageHeadFromSeo } from '../features/site/lauraSanity';
export const Route = createFileRoute('/prices')({
  loader: async () => (await import('virtual:laura-content')).default.prices,
  head: ({ loaderData }) =>
    pageHeadFromSeo({
      seo: loaderData?.seo ?? {},
      fallbackTitle: 'Prices',
      fallbackDescription:
        'A guide to art, creative events and tuition pricing.',
      path: '/prices',
    }),
  component: PricesRoute,
});
function PricesRoute() {
  return <PricesPage data={Route.useLoaderData()} />;
}
