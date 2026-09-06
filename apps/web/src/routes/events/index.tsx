import { createFileRoute } from '@tanstack/react-router';

import { getEvents } from '../../features/content/contentApi';
import { EventsPage } from '../../features/events/EventsPage';

export const Route = createFileRoute('/events/')({
  loader: () => getEvents(),
  component: EventsPage,
});
