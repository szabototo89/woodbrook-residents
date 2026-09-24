import styles from './gift-card.module.css';
import { resolveText } from '../../homeContent/homeContent';

export type GiftCardProps = Readonly<{
  eyebrow?: string;
  title?: string;
  copyLead?: string;
  copyRest?: string;
  buttonLabel?: string;
  cardUrl?: string;
}>;

const defaultProps = {
  eyebrow: 'Gift cards',
  title: 'The perfect gift',
  copyLead: 'Treat someone special to a Juliet Rose gift card.',
  copyRest: 'Available for any treatment or amount.',
  buttonLabel: 'Buy a gift card',
  cardUrl: '/gift-cards',
} as const;

export function GiftCard(props: GiftCardProps) {
  const eyebrow = resolveText(props.eyebrow, defaultProps.eyebrow);
  const title = resolveText(props.title, defaultProps.title);
  const copyLead = resolveText(props.copyLead, defaultProps.copyLead);
  const copyRest = resolveText(props.copyRest, defaultProps.copyRest);
  const buttonLabel = resolveText(props.buttonLabel, defaultProps.buttonLabel);
  const cardUrl = resolveText(props.cardUrl, defaultProps.cardUrl);

  return (
    <div className={styles.root}>
      <section
        className={styles.gift}
        id="gift-cards"
        aria-labelledby="gift-heading"
      >
        <div className={styles.giftVisual} aria-hidden="true" />
        <div className={styles.giftCopy}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 className={styles.sectionTitle} id="gift-heading">
            {title}
          </h2>
          <p>
            {copyLead}
            <br />
            {copyRest}
          </p>
        </div>
        <a className={styles.giftButton} href={cardUrl}>
          {buttonLabel} <span className={styles.iconArrow} aria-hidden="true" />
        </a>
      </section>
    </div>
  );
}
