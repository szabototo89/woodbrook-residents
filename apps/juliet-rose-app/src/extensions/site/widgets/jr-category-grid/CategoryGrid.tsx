import { CategoryCard } from './CategoryCard';
import styles from './category-grid.module.css';
import { resolveText } from '../../homeContent/homeContent';
import type { CategoryCard as CategoryCardData } from '../../treatments/treatments';

type CategoryGridProps = Readonly<{
  cards: readonly CategoryCardData[];
  eyebrow?: string;
  title?: string;
  viewAllLabel?: string;
  viewAllHref?: string;
}>;

export function CategoryGrid(props: CategoryGridProps) {
  const eyebrow = resolveText(props.eyebrow, 'Our treatments');
  const title = resolveText(props.title, 'Find the right treatment for you');
  const viewAllLabel = resolveText(props.viewAllLabel, 'View all treatments');
  const viewAllHref = resolveText(props.viewAllHref, '/treatments');
  return (
    <div className={styles.root}>
      <section
        className={styles.homeSection}
        id="treatments"
        aria-labelledby="treatments-heading"
      >
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>{eyebrow}</p>
              <h2 id="treatments-heading">{title}</h2>
            </div>
            <a className={styles.sectionLink} href={viewAllHref}>
              {viewAllLabel}{' '}
              <span className={styles.iconArrow} aria-hidden="true" />
            </a>
          </div>

          <div className={styles.categoryGrid}>
            {props.cards.map((card) => (
              <CategoryCard card={card} key={card.href} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
