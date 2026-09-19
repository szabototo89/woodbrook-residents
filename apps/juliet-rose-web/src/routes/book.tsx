import { createFileRoute } from '@tanstack/react-router';
import { format } from 'date-fns';

import { createPageHead } from '../app/siteMetadata';
import { BookingPage } from '../features/booking/BookingPage';

const description =
  'Request a Juliet Rose beauty treatment appointment in Stillorgan, Dublin.';

export const Route = createFileRoute('/book')({
  validateSearch: (search: Record<string, unknown>) => ({
    service: typeof search.service === 'string' ? search.service : undefined,
  }),
  // Snapshot "today" on the server so SSR and hydration render the same calendar.
  loader: () => ({ today: format(new Date(), 'yyyy-MM-dd') }),
  head: () => createPageHead({ title: 'Book', description, path: '/book' }),
  component: BookRoute,
});

function toLocalDate(today: string): Date {
  return new Date(`${today}T00:00:00`);
}

function BookRoute() {
  const { service } = Route.useSearch();
  const { today } = Route.useLoaderData();
  return (
    <BookingPage initialTreatmentSlug={service} today={toLocalDate(today)} />
  );
}
