import { listTreatments } from './treatmentCatalog';
import { TreatmentCategoryCard } from './TreatmentCategoryCard';

const massageTreatments = listTreatments().filter(
  (treatment) => treatment.category === 'Massage',
);

export default (
  <TreatmentCategoryCard category="Massage" treatments={massageTreatments} />
);
