import { createFileRoute } from '@tanstack/react-router';

import { createPageHead } from '../../app/siteMetadata';
import { getUpdateBySlug } from '../../features/content/contentApi';
import { UpdateDetailPage } from '../../features/updates/UpdateDetailPage';

export const Route = createFileRoute('/updates/$slug')({
  loader: ({ params }) => getUpdateBySlug({ data: { slug: params.slug } }),
  head: ({ loaderData, params }) =>
    createPageHead({
      title: loaderData?.title ?? 'Update unavailable',
      description:
        loaderData?.summary ??
        'This Woodbrook Residents update is unavailable.',
      path: `/updates/${params.slug}`,
    }),
  component: UpdateDetailPage,
});
