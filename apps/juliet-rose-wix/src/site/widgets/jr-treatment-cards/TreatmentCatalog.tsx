import styles from './jr-treatment-cards.module.css';
import {
  bookTreatmentUrl,
  CATEGORIES,
  formatTreatmentDuration,
  formatTreatmentPrice,
  type Treatment,
} from './treatments';

type TreatmentCatalogProps = Readonly<{
  treatments: readonly Treatment[];
}>;

export function TreatmentCatalog(props: TreatmentCatalogProps) {
  const sections = CATEGORIES.map((meta) => ({
    meta,
    treatments: props.treatments.filter(
      (treatment) => treatment.category === meta.category,
    ),
  })).filter((section) => section.treatments.length > 0);

  return (
    <div className={styles.catalog}>
      {sections.map((group) => (
        <section
          className={styles.category}
          id={group.meta.id}
          aria-labelledby={`category-${group.meta.id}`}
          key={group.meta.id}
        >
          <div className={styles.categoryHeading}>
            <span className={styles.categoryIcon} aria-hidden="true">
              <group.meta.Icon strokeWidth={1.5} />
            </span>
            <div>
              <h2 id={`category-${group.meta.id}`}>{group.meta.category}</h2>
              <p>{group.meta.description}</p>
            </div>
            <span className={styles.categoryCount}>
              {group.treatments.length} treatments
            </span>
          </div>
          <ul>
            {group.treatments.map((treatment) => (
              <li className={styles.row} key={treatment.slug}>
                <div>
                  <h3>{treatment.name}</h3>
                  <p>{formatTreatmentDuration(treatment.durationMinutes)}</p>
                </div>
                <div className={styles.rowAction}>
                  <strong>{formatTreatmentPrice(treatment.priceCents)}</strong>
                  <a
                    aria-label={`Book ${treatment.name}`}
                    href={bookTreatmentUrl(treatment)}
                  >
                    Book
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
