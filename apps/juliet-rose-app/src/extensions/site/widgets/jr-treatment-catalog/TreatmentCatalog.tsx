import { CategorySection } from './CategorySection';
import styles from './treatment-catalog.module.css';
import { CATEGORIES, type Treatment } from '../../treatments/treatments';

type TreatmentCatalogProps = Readonly<{
  treatments: readonly Treatment[];
  bookingBaseUrl?: string;
}>;

export function TreatmentCatalog(props: TreatmentCatalogProps) {
  const bookingBaseUrl = props.bookingBaseUrl ?? '/book';
  const sections = CATEGORIES.map((meta) => ({
    meta,
    treatments: props.treatments.filter(
      (treatment) => treatment.category === meta.category,
    ),
  })).filter((section) => section.treatments.length > 0);

  return (
    <div className={styles.root}>
      <div className={styles.catalog}>
        {sections.map((section) => (
          <CategorySection
            meta={section.meta}
            treatments={section.treatments}
            bookingBaseUrl={bookingBaseUrl}
            key={section.meta.id}
          />
        ))}
      </div>
    </div>
  );
}
