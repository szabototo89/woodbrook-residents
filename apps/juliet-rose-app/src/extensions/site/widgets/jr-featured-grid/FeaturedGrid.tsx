import { FeaturedCard } from './FeaturedCard';
import styles from './featured-grid.module.css';
import { resolveText } from '../../homeContent/homeContent';
import type { FeaturedTreatment } from '../../treatments/treatments';

type FeaturedGridProps = Readonly<{
  featured: readonly FeaturedTreatment[];
  bookingBaseUrl?: string;
  eyebrow?: string;
  title?: string;
  viewAllLabel?: string;
  viewAllHref?: string;
}>;

export function FeaturedGrid(props: FeaturedGridProps) {
  const bookingBaseUrl = resolveText(props.bookingBaseUrl, '/book');
  const eyebrow = resolveText(props.eyebrow, 'Popular choices');
  const title = resolveText(props.title, 'Featured treatments');
  const viewAllLabel = resolveText(props.viewAllLabel, 'View all treatments');
  const viewAllHref = resolveText(props.viewAllHref, '/treatments');
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
              <p className={styles.eyebrow}>{eyebrow}</p>
              <h2 id="featured-heading">{title}</h2>
            </div>
            <a className={styles.sectionLink} href={viewAllHref}>
              {viewAllLabel}{' '}
              <span className={styles.iconArrow} aria-hidden="true" />
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
