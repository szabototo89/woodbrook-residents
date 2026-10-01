import { createFileRoute, notFound } from '@tanstack/react-router';
import { createPageHead } from '../app/siteMetadata';
import { GalleryDetailPage } from '../features/site/GalleryDetailPage';
import { GalleryPhotoNotFound } from '../features/site/GalleryPhotoNotFound';
import {
  getGalleryPhoto,
  galleryPhotoPath,
} from '../features/site/galleryContent';

export const Route = createFileRoute('/gallery_/$photoId')({
  loader: ({ params }) => {
    const photo = getGalleryPhoto(params.photoId);
    if (!photo) throw notFound();
    return photo;
  },
  head: ({ loaderData: photo }) =>
    photo
      ? createPageHead({
          title: photo.image.title,
          description: photo.image.description?.trim() || photo.image.alt,
          path: galleryPhotoPath(photo.image),
        })
      : createPageHead({
          title: 'Picture not found',
          description: 'Explore the gallery to find another picture.',
          path: '/gallery',
        }),
  component: GalleryPhotoRoute,
  notFoundComponent: GalleryPhotoNotFound,
});

function GalleryPhotoRoute() {
  return <GalleryDetailPage photo={Route.useLoaderData()} />;
}
