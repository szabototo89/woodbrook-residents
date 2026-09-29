import { createFileRoute } from '@tanstack/react-router';
import { createPageHead } from '../app/siteMetadata';
import { GalleryPage } from '../features/site/SitePages';

export const Route = createFileRoute('/gallery')({
  head: () =>
    createPageHead({
      title: 'Gallery',
      description: 'A glimpse of Laura Faichney paintings and creative work.',
      path: '/gallery',
    }),
  component: GalleryPage,
});
