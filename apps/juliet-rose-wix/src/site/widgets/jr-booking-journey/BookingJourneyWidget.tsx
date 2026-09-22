import { BookingJourney, type BookingJourneyProps } from './BookingJourney';
import { useWixViewMode } from '../../useWixViewMode';

export function BookingJourneyWidget(props: BookingJourneyProps) {
  const viewMode = useWixViewMode(props.viewMode);
  return <BookingJourney {...props} viewMode={viewMode} />;
}
