import { createFileRoute } from '@tanstack/react-router';

import { createPageHead } from '../../app/siteMetadata';
import { getEvents } from '../../features/content/contentApi';
import { EventsPage } from '../../features/events/EventsPage';

export const Route = createFileRoute('/events/')({
  loader: () => getEvents(),
  head: () =>
    createPageHead({
      title: 'Events',
      description:
        'Confirmed community meetings, activities, and local events for Woodbrook residents and nearby Shankill.',
      path: '/events',
    }),
  component: EventsPage,
});
