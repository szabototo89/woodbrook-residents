import { BookingJourney } from './BookingJourney';
import { createLocalBookingProvider } from './localBookingProvider';

const bookingProvider = createLocalBookingProvider();

export function BookingPage(props: { initialTreatmentSlug?: string }) {
  return (
    <main id="main-content" className="booking-page page-width">
      <BookingJourney
        initialTreatmentSlug={props.initialTreatmentSlug}
        provider={bookingProvider}
      />
    </main>
  );
}
