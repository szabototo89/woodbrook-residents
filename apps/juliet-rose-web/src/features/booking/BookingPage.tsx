import { BookingJourney } from './BookingJourney';
import { createLocalBookingProvider } from './localBookingProvider';

const bookingProvider = createLocalBookingProvider();

export function BookingPage(props: {
  initialTreatmentSlug?: string;
  today?: Date;
}) {
  return (
    <main id="main-content" className="booking-page">
      <BookingJourney
        initialTreatmentSlug={props.initialTreatmentSlug}
        provider={bookingProvider}
        today={props.today}
      />
    </main>
  );
}
