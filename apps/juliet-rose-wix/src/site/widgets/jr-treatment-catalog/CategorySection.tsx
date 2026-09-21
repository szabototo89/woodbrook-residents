import styles from './treatment-catalog.module.css';
import { TreatmentRow } from './TreatmentRow';
import type { CategoryMeta, Treatment } from '../../treatments/treatments';

type CategorySectionProps = Readonly<{
  meta: CategoryMeta;
  treatments: readonly Treatment[];
  bookingBaseUrl: string;
}>;

export function CategorySection(props: CategorySectionProps) {
  return (
    <section
      className={styles.category}
      id={props.meta.id}
      aria-labelledby={`category-${props.meta.id}`}
    >
      <div className={styles.categoryHeading}>
        <span className={styles.categoryIcon} aria-hidden="true">
          <props.meta.Icon strokeWidth={1.5} />
        </span>
        <div>
          <h2 id={`category-${props.meta.id}`}>{props.meta.category}</h2>
          <p>{props.meta.description}</p>
        </div>
        <span className={styles.categoryCount}>
          {props.treatments.length} treatments
        </span>
      </div>
      <ul>
        {props.treatments.map((treatment) => (
          <TreatmentRow
            treatment={treatment}
            bookingBaseUrl={props.bookingBaseUrl}
            key={treatment.slug}
          />
        ))}
      </ul>
    </section>
  );
}
