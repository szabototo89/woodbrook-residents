import { requireTreatmentBySlug } from './treatmentCatalog';
import { TreatmentRow } from './TreatmentRow';

export default (
  <ul>
    <TreatmentRow treatment={requireTreatmentBySlug('swedish-massage')} />
  </ul>
);
