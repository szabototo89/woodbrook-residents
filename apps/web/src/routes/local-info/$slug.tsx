import { createFileRoute } from '@tanstack/react-router';

import { getResourceBySlug } from '../../features/content/contentApi';
import { LocalServiceDetailPage } from '../../features/resources/LocalServiceDetailPage';

export const Route = createFileRoute('/local-info/$slug')({
  loader: ({ params }) => getResourceBySlug({ data: { slug: params.slug } }),
  component: LocalServiceDetailPage,
});
