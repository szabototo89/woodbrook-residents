import { BookingJourney } from './BookingJourney';
import { createLocalBookingProvider } from './localBookingProvider';

import './booking.css';

const bookingProvider = createLocalBookingProvider();

export function BookingPage(props: { initialTreatmentSlug?: string }) {
  return (
    <main id="main-content" className="booking-page">
      <BookingJourney
        initialTreatmentSlug={props.initialTreatmentSlug}
        provider={bookingProvider}
      />
    </main>
  );
}
