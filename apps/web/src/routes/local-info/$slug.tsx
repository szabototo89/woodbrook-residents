import { createFileRoute } from '@tanstack/react-router';

import { createPageHead } from '../../app/siteMetadata';
import { getResourceBySlug } from '../../features/content/contentApi';
import { getDublinCalendarDate } from '../../features/resources/collectionScheduleUtils';
import { LocalServiceDetailPage } from '../../features/resources/LocalServiceDetailPage';

export const Route = createFileRoute('/local-info/$slug')({
  loader: async ({ params }) => ({
    resource: await getResourceBySlug({ data: { slug: params.slug } }),
    today: getDublinCalendarDate(),
  }),
  head: ({ loaderData, params }) =>
    createPageHead({
      title: loaderData?.resource?.title ?? 'Service unavailable',
      description:
        loaderData?.resource?.description ??
        'This Woodbrook Residents local service listing is unavailable.',
      path: `/local-info/${params.slug}`,
    }),
  component: LocalServiceDetailPage,
});
