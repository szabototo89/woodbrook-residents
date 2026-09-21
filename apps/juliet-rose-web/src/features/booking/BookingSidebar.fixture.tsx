import { requireTreatmentBySlug } from '../treatments/treatmentCatalog';
import { BookingSidebar } from './BookingSidebar';

import './booking.css';

export default {
  Selected: (
    <>
      <BookingSidebar
        treatment={requireTreatmentBySlug('swedish-massage')}
        date={new Date(2026, 9, 19)}
        time="10:00"
      />
      <p className="cosmos-viewport-note">
        BookingSidebar is hidden below 901px by design — widen the preview to
        see it.
      </p>
    </>
  ),
  Empty: (
    <>
      <BookingSidebar treatment={undefined} date={undefined} time="" />
      <p className="cosmos-viewport-note">
        BookingSidebar is hidden below 901px by design — widen the preview to
        see it.
      </p>
    </>
  ),
};
