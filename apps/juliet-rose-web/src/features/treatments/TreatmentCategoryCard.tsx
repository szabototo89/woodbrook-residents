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

export function TreatmentCategoryCard(props: TreatmentCategoryCardProps) {
  const id = categoryId(props.category);
  const { description, Icon } = treatmentCategoryPresentation[props.category];

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
          <h2 id={`category-${id}`}>{props.category}</h2>
          <p>{description}</p>
        </div>
        <span className="catalog-category-count">
          {props.treatments.length} treatments
        </span>
      </div>
      <ul>
        {props.treatments.map((treatment) => (
          <TreatmentRow treatment={treatment} key={treatment.slug} />
        ))}
      </ul>
    </section>
  );
}
