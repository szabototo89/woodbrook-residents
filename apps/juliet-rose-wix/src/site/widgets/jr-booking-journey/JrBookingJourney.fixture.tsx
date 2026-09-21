import { JrBookingJourney } from './JrBookingJourney';

export default {
  Default: <JrBookingJourney today="2026-09-19" />,
  PreselectedService: (
    <JrBookingJourney today="2026-09-19" initialService="swedish-massage" />
  ),
};
