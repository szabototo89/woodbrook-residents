import { BookingJourney } from './BookingJourney';

export default {
  Default: <BookingJourney today="2026-09-19" />,
  PreselectedService: (
    <BookingJourney today="2026-09-19" initialService="swedish-massage" />
  ),
};
