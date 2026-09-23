import styles from './jr-gift-card-page.module.css';
import { giftCardImage } from '../../imageAssets';

export type GiftCardPageProps = Readonly<{
  checkoutUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  phoneHref?: string;
  phoneLabel?: string;
  emailHref?: string;
  emailLabel?: string;
}>;

const defaults = {
  checkoutUrl: 'https://www.julietrosebeauty.com/gift-card',
  imageUrl: giftCardImage,
  imageAlt: 'A Juliet Rose gift card surrounded by soft florals',
  phoneHref: 'tel:+353852867059',
  phoneLabel: '085 286 7059',
  emailHref: 'mailto:denizzza1@gmail.com',
  emailLabel: 'send an email',
} as const;

const highlights = [
  {
    title: 'Choose an amount that feels right',
    description:
      'Pick from the available values or enter your own amount at checkout.',
  },
  {
    title: 'Give them room to choose',
    description:
      'They can decide which treatment and moment of care suits them best.',
  },
  {
    title: 'Use it towards any Juliet Rose treatment',
    description:
      'From time to unwind to a favourite beauty treatment, the choice is theirs.',
  },
] as const;

export function GiftCardPage(props: GiftCardPageProps) {
  return (
    <main className={styles.root}>
      <section className={styles.hero} aria-labelledby="gift-card-page-heading">
        <div className={styles.heroInner}>
          <div className={styles.photoWrap}>
            <img
              className={styles.photo}
              src={props.imageUrl ?? defaults.imageUrl}
              alt={props.imageAlt ?? defaults.imageAlt}
              width="800"
              height="347"
            />
            <p className={styles.caption}>A little time, just for them</p>
          </div>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Juliet Rose eGift cards</p>
            <h1 id="gift-card-page-heading">Give the gift of time to unwind</h1>
            <p className={styles.lead}>
              Treat someone special to a Juliet Rose gift card and let them
              choose the treatment that feels just right.
            </p>
            <a
              className={styles.primaryButton}
              href={props.checkoutUrl ?? defaults.checkoutUrl}
              rel="external"
            >
              Continue to gift card checkout
            </a>
            <p className={styles.handoff}>
              You’ll continue to Juliet Rose’s existing checkout to choose the
              value and complete your purchase.
            </p>
          </div>
        </div>
      </section>

      <section
        className={styles.details}
        aria-labelledby="gift-details-heading"
      >
        <div className={styles.detailsHeading}>
          <p className={styles.eyebrow}>A thoughtful gift, made easy</p>
          <h2 id="gift-details-heading">Their treat, their choice</h2>
        </div>
        <ol className={styles.highlights}>
          {highlights.map((highlight, index) => (
            <li key={highlight.title}>
              <span className={styles.number} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{highlight.title}</h3>
              <p>{highlight.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.help} aria-labelledby="gift-help-heading">
        <div>
          <p className={styles.eyebrow}>Need a little help?</p>
          <h2 id="gift-help-heading">We’re happy to help</h2>
        </div>
        <p>
          Have a question before you buy? Call Diana on{' '}
          <a href={props.phoneHref ?? defaults.phoneHref}>
            {props.phoneLabel ?? defaults.phoneLabel}
          </a>{' '}
          or{' '}
          <a href={props.emailHref ?? defaults.emailHref}>
            {props.emailLabel ?? defaults.emailLabel}
          </a>
          .
        </p>
      </section>
    </main>
  );
}
