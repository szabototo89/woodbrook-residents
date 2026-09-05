import { createFileRoute } from '@tanstack/react-router';

import { getUpdateBySlug } from '../../features/content/contentApi';
import { UpdateDetailPage } from '../../features/updates/UpdateDetailPage';

export const Route = createFileRoute('/updates/$slug')({
  loader: ({ params }) => getUpdateBySlug({ data: { slug: params.slug } }),
  component: UpdateDetailPage,
});
