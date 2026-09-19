import { BookingJourney } from './BookingJourney';
import { createLocalBookingProvider } from './localBookingProvider';

const bookingProvider = createLocalBookingProvider();

export function BookingPage({
  initialTreatmentSlug,
}: {
  initialTreatmentSlug?: string;
}) {
  return (
    <main id="main-content" className="booking-page page-width">
      <BookingJourney
        initialTreatmentSlug={initialTreatmentSlug}
        provider={bookingProvider}
      />
    </main>
  );
}
