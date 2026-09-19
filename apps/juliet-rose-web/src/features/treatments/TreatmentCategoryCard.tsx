import type { Treatment, TreatmentCategory } from './treatmentCatalog';
import {
  categoryId,
  treatmentCategoryPresentation,
} from './treatmentCategoryPresentation';
import { TreatmentRow } from './TreatmentRow';

type TreatmentCategoryCardProps = {
  category: TreatmentCategory;
  treatments: Treatment[];
};

export function TreatmentCategoryCard({
  category,
  treatments,
}: TreatmentCategoryCardProps) {
  const id = categoryId(category);
  const { description, Icon } = treatmentCategoryPresentation[category];

  return (
    <section
      className="catalog-category"
      id={id}
      aria-labelledby={`category-${id}`}
    >
      <div className="catalog-category-heading">
        <span className="catalog-category-icon" aria-hidden="true">
          <Icon strokeWidth={1.5} />
        </span>
        <div>
          <h2 id={`category-${id}`}>{category}</h2>
          <p>{description}</p>
        </div>
        <span className="catalog-category-count">
          {treatments.length} treatments
        </span>
      </div>
      <ul>
        {treatments.map((treatment) => (
          <TreatmentRow treatment={treatment} key={treatment.slug} />
        ))}
      </ul>
    </section>
  );
}
