import { galleryCollections, type GalleryCollection } from './siteContent';

export function galleryCollectionPath(collection: GalleryCollection) {
  return `/gallery/${collection.slug}`;
}

export function getGalleryCollection(slug: string) {
  return galleryCollections.find((collection) => collection.slug === slug);
}
