import { requireTreatmentBySlug } from './treatmentCatalog';
import { TreatmentRow } from './TreatmentRow';

import './treatments.css';

export default (
  <ul>
    <TreatmentRow treatment={requireTreatmentBySlug('swedish-massage')} />
  </ul>
);
