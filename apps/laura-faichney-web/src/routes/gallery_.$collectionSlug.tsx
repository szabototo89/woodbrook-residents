import { createFileRoute, notFound } from '@tanstack/react-router';
import { createPageHead } from '../app/siteMetadata';
import { GalleryCollectionPage } from '../features/site/GalleryCollectionPage';
import { GalleryCollectionNotFound } from '../features/site/GalleryCollectionNotFound';
import { useCollectionSwipeNavigation } from '../features/site/useCollectionSwipeNavigation';
import {
  LauraSanitySource,
  galleryCollectionPath,
  getGalleryCollection,
} from '../features/site/lauraSanity';

export const Route = createFileRoute('/gallery_/$collectionSlug')({
  staleTime: 30_000,
  loader: async ({ params }) => {
    const gallery = await new LauraSanitySource().loadGallery();
    const collection = getGalleryCollection(
      gallery.collections,
      params.collectionSlug,
    );
    if (!collection) throw notFound();
    return { collection, collections: gallery.collections };
  },
  head: ({ loaderData }) => {
    const collection = loaderData?.collection;
    return collection
      ? createPageHead({
          title: collection.title,
          description: collection.description,
          path: galleryCollectionPath(collection),
        })
      : createPageHead({
          title: 'Collection not found',
          description: 'Explore the gallery to find another collection.',
          path: '/gallery',
        });
  },
  component: GalleryCollectionRoute,
  notFoundComponent: GalleryCollectionNotFound,
});

function GalleryCollectionRoute() {
  const { collection, collections } = Route.useLoaderData();
  const navigation = useCollectionSwipeNavigation(collection, collections);
  return <GalleryCollectionPage collection={collection} {...navigation} />;
}
