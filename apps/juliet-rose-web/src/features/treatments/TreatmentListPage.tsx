import type { TreatmentCategory } from './treatmentCatalog';
import {
  listTreatments,
  TREATMENT_SOURCE_ACCESSED_AT,
  TREATMENT_SOURCE_URL,
} from './treatmentCatalog';
import { TreatmentRow } from './TreatmentRow';

const categories: TreatmentCategory[] = [
  'Massage',
  'Facials & skin',
  'Beauty essentials',
  'Packages',
];

function categoryId(category: TreatmentCategory): string {
  return category.toLowerCase().replace('&', 'and').replaceAll(' ', '-');
}

export function TreatmentListPage() {
  const treatments = listTreatments();

  return (
    <main id="main-content" className="inner-page">
      <header className="inner-page-header page-width">
        <p className="eyebrow">Our services</p>
        <h1>Treatments &amp; prices</h1>
        <p>
          Choose a treatment and send an appointment request at a date and time
          that suits you.
        </p>
      </header>

      <div className="treatment-catalog page-width">
        {categories.map((category) => (
          <section
            className="catalog-category"
            id={categoryId(category)}
            aria-labelledby={`category-${categoryId(category)}`}
            key={category}
          >
            <div className="catalog-category-heading">
              <h2 id={`category-${categoryId(category)}`}>{category}</h2>
              <span>
                {treatments.filter((item) => item.category === category).length}{' '}
                treatments
              </span>
            </div>
            <ul>
              {treatments
                .filter((item) => item.category === category)
                .map((treatment) => (
                  <TreatmentRow treatment={treatment} key={treatment.slug} />
                ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="catalog-source page-width">
        Information checked 19 September 2026 against the{' '}
        <a href={TREATMENT_SOURCE_URL}>current Juliet Rose service list</a>.
        Source accessed {TREATMENT_SOURCE_ACCESSED_AT}.
      </p>
    </main>
  );
}
