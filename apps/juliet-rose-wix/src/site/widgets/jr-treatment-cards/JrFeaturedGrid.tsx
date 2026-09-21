import styles from './jr-treatment-cards.module.css';
import {
  bookTreatmentUrl,
  formatFeaturedDuration,
  formatTreatmentPrice,
  type FeaturedTreatment,
} from './treatments';

type JrFeaturedGridProps = Readonly<{
  featured: readonly FeaturedTreatment[];
  viewAllLabel?: string;
  viewAllHref?: string;
}>;

export function JrFeaturedGrid(props: JrFeaturedGridProps) {
  const viewAllLabel = props.viewAllLabel ?? 'View all treatments';
  const viewAllHref = props.viewAllHref ?? '/treatments';
  return (
    <section
      className={styles.featuredSection}
      id="featured"
      aria-labelledby="featured-heading"
    >
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
          <a
            className={styles.treatmentCard}
            href={bookTreatmentUrl(item.treatment)}
            key={item.treatment.slug}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.imageAlt}
                width="1536"
                height="1024"
                loading="lazy"
                decoding="async"
              />
            ) : null}
            <div className={styles.treatmentCopy}>
              <h3>{item.treatment.name}</h3>
              <div className={styles.treatmentMeta}>
                <span className={styles.duration}>
                  <span className={styles.iconClock} aria-hidden="true" />
                  {formatFeaturedDuration(item.treatment.durationMinutes)}
                </span>
                <strong>
                  {formatTreatmentPrice(item.treatment.priceCents)}
                </strong>
              </div>
              <span className={styles.cardButton} aria-hidden="true">
                Book now{' '}
                <span className={styles.iconArrow} aria-hidden="true" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
