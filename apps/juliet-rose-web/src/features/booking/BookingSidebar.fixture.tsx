import { requireTreatmentBySlug } from '../treatments/treatmentCatalog';
import { BookingSidebar } from './BookingSidebar';

export default {
  Selected: (
    <BookingSidebar
      treatment={requireTreatmentBySlug('swedish-massage')}
      date={new Date(2026, 9, 19)}
      time="10:00"
    />
  ),
  Empty: <BookingSidebar treatment={undefined} date={undefined} time="" />,
};
