import { FeaturedCard } from './FeaturedCard';
import styles from './featured-grid.module.css';
import type { FeaturedTreatment } from '../../treatments/treatments';

type FeaturedGridProps = Readonly<{
  featured: readonly FeaturedTreatment[];
  bookingBaseUrl?: string;
  viewAllLabel?: string;
  viewAllHref?: string;
}>;

export function FeaturedGrid(props: FeaturedGridProps) {
  const bookingBaseUrl = props.bookingBaseUrl ?? '/book';
  const viewAllLabel = props.viewAllLabel ?? 'View all treatments';
  const viewAllHref = props.viewAllHref ?? '/treatments';
  return (
    <div className={styles.root}>
      <section
        className={styles.featuredSection}
        id="featured"
        aria-labelledby="featured-heading"
      >
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Popular choices</p>
              <h2 id="featured-heading">Featured treatments</h2>
            </div>
            <a className={styles.sectionLink} href={viewAllHref}>
              {viewAllLabel}
            </a>
          </div>

          <div className={styles.featuredGrid}>
            {props.featured.map((item) => (
              <FeaturedCard
                item={item}
                bookingBaseUrl={bookingBaseUrl}
                key={item.treatment.slug}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
