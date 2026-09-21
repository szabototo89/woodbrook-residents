import styles from './jr-treatment-cards.module.css';
import type { CategoryCard } from './treatments';

type CategoryGridProps = Readonly<{
  cards: readonly CategoryCard[];
  viewAllLabel?: string;
  viewAllHref?: string;
}>;

export function CategoryGrid(props: CategoryGridProps) {
  const viewAllLabel = props.viewAllLabel ?? 'View all treatments';
  const viewAllHref = props.viewAllHref ?? '/treatments';
  return (
    <section
      className={styles.homeSection}
      id="treatments"
      aria-labelledby="treatments-heading"
    >
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>Our treatments</p>
          <h2 id="treatments-heading">Find the right treatment for you</h2>
        </div>
        <a className={styles.sectionLink} href={viewAllHref}>
          {viewAllLabel}
        </a>
      </div>

      <div className={styles.categoryGrid}>
        {props.cards.map((card) => (
          <a className={styles.categoryCard} href={card.href} key={card.href}>
            <img
              src={card.image}
              alt=""
              width="1536"
              height="1024"
              loading="lazy"
              decoding="async"
            />
            <div className={styles.categoryCopy}>
              <h3>{card.category}</h3>
              <p>{card.description}</p>
              <span className={styles.categoryLink} aria-hidden="true">
                {card.action}{' '}
                <span className={styles.iconArrow} aria-hidden="true" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
