import { createFileRoute } from '@tanstack/react-router';
import { GalleryPage } from '../features/site/SitePages';

export const Route = createFileRoute('/gallery')({
  head: () => ({
    meta: [{ title: 'Gallery | Laura Faichney All Things Art' }],
  }),
  component: GalleryPage,
});
