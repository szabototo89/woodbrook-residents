import type { TreatmentCategory } from './treatmentCatalog';
import {
  listTreatments,
  TREATMENT_SOURCE_ACCESSED_AT,
  TREATMENT_SOURCE_URL,
} from './treatmentCatalog';
import { TreatmentCategoryCard } from './TreatmentCategoryCard';
import { TreatmentGuidance } from './TreatmentGuidance';
import { TreatmentHero } from './TreatmentHero';

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

      <footer className="catalog-source page-width">
        <p>
          Information checked 19 September 2026 against the{' '}
          <a href={TREATMENT_SOURCE_URL}>current Juliet Rose service list</a>.
        </p>
        <p>Source accessed {TREATMENT_SOURCE_ACCESSED_AT}.</p>
      </footer>
    </main>
  );
}
