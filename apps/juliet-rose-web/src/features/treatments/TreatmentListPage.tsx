import type { TreatmentCategory } from './treatmentCatalog';
import { listTreatments } from './treatmentCatalog';
import { TreatmentCategoryCard } from './TreatmentCategoryCard';
import { TreatmentGuidance } from './TreatmentGuidance';
import { TreatmentHero } from './TreatmentHero';

import './treatments.css';

const categories: TreatmentCategory[] = [
  'Massage',
  'Facials & skin',
  'Beauty essentials',
  'Packages',
];

export function TreatmentListPage() {
  const treatments = listTreatments();

  return (
    <main id="main-content" className="inner-page treatment-page">
      <TreatmentHero />

      <div className="treatment-catalog page-width">
        {categories.map((category) => {
          const categoryTreatments = treatments.filter(
            (treatment) => treatment.category === category,
          );

          return (
            <TreatmentCategoryCard
              category={category}
              treatments={categoryTreatments}
              key={category}
            />
          );
        })}
      </div>

      <TreatmentGuidance />
    </main>
  );
}
