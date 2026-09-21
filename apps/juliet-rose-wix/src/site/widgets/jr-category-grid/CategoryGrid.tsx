import { CategoryCard } from './CategoryCard';
import styles from './category-grid.module.css';
import type { CategoryCard as CategoryCardData } from '../../treatments/treatments';

type CategoryGridProps = Readonly<{
  cards: readonly CategoryCardData[];
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
          <CategoryCard card={card} key={card.href} />
        ))}
      </div>
    </section>
  );
}
