import { HomePage, type HomePageProps } from './HomePage';
import { useBookingPolicy } from '../../bookingPolicy/useBookingPolicy';
import { useContactDetails } from '../../contactDetails/useContactDetails';
import { useHomeContent } from '../../homeContent/useHomeContent';
import { useWixViewMode } from '../../useWixViewMode';

export function HomePageWidget(props: HomePageProps) {
  const viewMode = useWixViewMode(props.viewMode);
  const homeContent = useHomeContent(viewMode);
  const contact = useContactDetails(viewMode);
  const policy = useBookingPolicy(viewMode);
  return (
    <HomePage
      {...props}
      viewMode={viewMode}
      homeContent={homeContent}
      contact={contact}
      policy={policy}
    />
  );
}
