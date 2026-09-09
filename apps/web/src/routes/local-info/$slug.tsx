import { createFileRoute } from '@tanstack/react-router';

import { createPageHead } from '../../app/siteMetadata';
import { getResourceBySlug } from '../../features/content/contentApi';
import { LocalServiceDetailPage } from '../../features/resources/LocalServiceDetailPage';

export const Route = createFileRoute('/local-info/$slug')({
  loader: ({ params }) => getResourceBySlug({ data: { slug: params.slug } }),
  head: ({ loaderData, params }) =>
    createPageHead({
      title: loaderData?.title ?? 'Service unavailable',
      description:
        loaderData?.description ??
        'This Woodbrook Residents local service listing is unavailable.',
      path: `/local-info/${params.slug}`,
    }),
  component: LocalServiceDetailPage,
});
