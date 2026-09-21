import styles from './category-grid.module.css';
import type { CategoryCard as CategoryCardData } from '../../treatments/treatments';

type CategoryCardProps = Readonly<{
  card: CategoryCardData;
}>;

export function CategoryCard(props: CategoryCardProps) {
  return (
    <a className={styles.categoryCard} href={props.card.href}>
      <img
        src={props.card.image}
        alt=""
        width="1536"
        height="1024"
        loading="lazy"
        decoding="async"
      />
      <div className={styles.categoryCopy}>
        <h3>{props.card.category}</h3>
        <p>{props.card.description}</p>
        <span className={styles.categoryLink} aria-hidden="true">
          {props.card.action}{' '}
          <span className={styles.iconArrow} aria-hidden="true" />
        </span>
      </div>
    </a>
  );
}
