import { createFileRoute } from '@tanstack/react-router';

import { createPageHead } from '../../app/siteMetadata';
import { getEventBySlug } from '../../features/content/contentApi';
import { EventDetailPage } from '../../features/events/EventDetailPage';

export const Route = createFileRoute('/events/$slug')({
  loader: ({ params }) => getEventBySlug({ data: { slug: params.slug } }),
  head: ({ loaderData, params }) =>
    createPageHead({
      title: loaderData?.title ?? 'Event unavailable',
      description:
        loaderData?.summary ?? 'This Woodbrook Residents event is unavailable.',
      path: `/events/${params.slug}`,
    }),
  component: EventDetailPage,
});
