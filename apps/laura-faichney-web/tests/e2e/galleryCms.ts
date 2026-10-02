import { readLauraSnapshot } from '../../scripts/lauraSnapshot';

export async function galleryCollections() {
  const { gallery } = await readLauraSnapshot();
  return gallery.collections.map((collection) => ({
    ...collection,
    photos: collection.photos.map((photo) => photo.alt),
  }));
}

export async function browsableCollections() {
  const collections = (await galleryCollections()).filter(
    (collection) => collection.photos.length > 1,
  );
  if (collections.length === 0)
    throw new Error(
      'A collection with multiple pictures is required for browsing tests',
    );
  return collections;
}
