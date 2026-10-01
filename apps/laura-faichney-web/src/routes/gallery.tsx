import { createFileRoute } from '@tanstack/react-router';
import { GalleryPage } from '../features/site/SitePages';
import {
  LauraSanitySource,
  pageHeadFromSeo,
} from '../features/site/lauraSanity';

export const Route = createFileRoute('/gallery')({
  loader: () => new LauraSanitySource().loadGallery(),
  head: ({ loaderData }) =>
    pageHeadFromSeo({
      seo: loaderData?.seo ?? {},
      fallbackTitle: 'Gallery',
      fallbackDescription:
        'A glimpse of Laura Faichney paintings and creative work.',
      path: '/gallery',
    }),
  component: GalleryRoute,
});

function GalleryRoute() {
  const data = Route.useLoaderData();
  return <GalleryPage data={data} />;
}
