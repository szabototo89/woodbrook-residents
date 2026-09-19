import { createFileRoute } from '@tanstack/react-router';

import { createPageHead } from '../app/siteMetadata';
import { BookingPage } from '../features/booking/BookingPage';

const description =
  'Request a Juliet Rose beauty treatment appointment in Stillorgan, Dublin.';

export const Route = createFileRoute('/book')({
  validateSearch: (search: Record<string, unknown>) => ({
    service: typeof search.service === 'string' ? search.service : undefined,
  }),
  head: () => createPageHead({ title: 'Book', description, path: '/book' }),
  component: BookRoute,
});

function BookRoute() {
  const { service } = Route.useSearch();
  return <BookingPage initialTreatmentSlug={service} />;
}
