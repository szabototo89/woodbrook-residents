import { createFileRoute, notFound } from '@tanstack/react-router';
import { createPageHead } from '../app/siteMetadata';
import { GalleryCollectionPage } from '../features/site/GalleryCollectionPage';
import { GalleryCollectionNotFound } from '../features/site/GalleryCollectionNotFound';
import {
  getGalleryCollection,
  galleryCollectionPath,
} from '../features/site/galleryContent';

export const Route = createFileRoute('/gallery_/$collectionSlug')({
  loader: ({ params }) => {
    const collection = getGalleryCollection(params.collectionSlug);
    if (!collection) throw notFound();
    return collection;
  },
  head: ({ loaderData: collection }) =>
    collection
      ? createPageHead({
          title: collection.title,
          description: collection.description,
          path: galleryCollectionPath(collection),
        })
      : createPageHead({
          title: 'Collection not found',
          description: 'Explore the gallery to find another collection.',
          path: '/gallery',
        }),
  component: GalleryCollectionRoute,
  notFoundComponent: GalleryCollectionNotFound,
});

function GalleryCollectionRoute() {
  return <GalleryCollectionPage collection={Route.useLoaderData()} />;
}
