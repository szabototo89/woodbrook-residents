import { createFileRoute } from '@tanstack/react-router';
import { GalleryPage } from '../features/site/SitePages';
import { pageHeadFromSeo } from '../features/site/lauraSanity';
import { serviceDiscoveryCopy } from '../features/site/serviceDiscoveryCopy';

export const Route = createFileRoute('/gallery')({
  loader: async () => (await import('virtual:laura-content')).default.gallery,
  head: ({ loaderData }) =>
    pageHeadFromSeo({
      seo: loaderData?.seo ?? {},
      fallbackTitle: serviceDiscoveryCopy.gallery.title,
      fallbackDescription: serviceDiscoveryCopy.gallery.description,
      path: '/gallery',
    }),
  component: GalleryRoute,
});

function GalleryRoute() {
  const data = Route.useLoaderData();
  return <GalleryPage data={data} />;
}
