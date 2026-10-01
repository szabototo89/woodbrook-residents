import { galleryImages, type GalleryPhoto } from './siteContent';

export function galleryPhotoPath(image: GalleryPhoto) {
  return `/gallery/${image.id}`;
}

export function getGalleryPhoto(id: string) {
  const index = galleryImages.findIndex((image) => String(image.id) === id);
  const image = galleryImages[index];
  if (!image) return undefined;

  const total = galleryImages.length;
  return {
    image,
    index,
    total,
    previous: galleryImages[(index - 1 + total) % total]!,
    next: galleryImages[(index + 1) % total]!,
  };
}

export type GalleryPhotoDetail = NonNullable<
  ReturnType<typeof getGalleryPhoto>
>;
