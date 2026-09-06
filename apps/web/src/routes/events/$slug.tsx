import { createFileRoute } from '@tanstack/react-router';

import { getEventBySlug } from '../../features/content/contentApi';
import { EventDetailPage } from '../../features/events/EventDetailPage';

export const Route = createFileRoute('/events/$slug')({
  loader: ({ params }) => getEventBySlug({ data: { slug: params.slug } }),
  component: EventDetailPage,
});
