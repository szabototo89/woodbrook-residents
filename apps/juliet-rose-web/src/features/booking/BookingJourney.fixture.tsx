import { BookingJourney } from './BookingJourney';
import { createLocalBookingProvider } from './localBookingProvider';

const provider = createLocalBookingProvider();

export default (
  <BookingJourney
    initialTreatmentSlug="swedish-massage"
    provider={provider}
    today={new Date(2026, 9, 15)}
  />
);
