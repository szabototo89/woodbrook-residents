const GIFT_CARD_CHECKOUT_URL = 'https://www.julietrosebeauty.com/gift-card';

const giftCardHighlights = [
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

export function GiftCardPage() {
  return (
    <main id="main-content" className="gift-card-page">
      <section className="gift-card-hero" aria-labelledby="gift-card-heading">
        <div className="gift-card-hero-inner page-width">
          <div className="gift-card-photo-wrap">
            <img
              className="gift-card-photo"
              src="/images/gift-card.jpg"
              alt="A Juliet Rose gift card surrounded by soft florals"
              width="1200"
              height="520"
              fetchPriority="high"
            />
            <p className="gift-card-photo-caption">
              A little time, just for them
            </p>
          </div>

          <div className="gift-card-hero-copy">
            <p className="eyebrow">Juliet Rose eGift cards</p>
            <h1 id="gift-card-heading">Give the gift of time to unwind</h1>
            <p className="gift-card-lead">
              Treat someone special to a Juliet Rose gift card and let them
              choose the treatment that feels just right.
            </p>
            <a
              className="primary-button gift-card-checkout-link"
              href={GIFT_CARD_CHECKOUT_URL}
              rel="external"
            >
              Continue to gift card checkout
              <span className="icon-arrow" aria-hidden="true" />
            </a>
            <p className="gift-card-handoff">
              You’ll continue to Juliet Rose’s existing checkout to choose the
              value and complete your purchase.
            </p>
          </div>
        </div>
      </section>

      <section
        className="gift-card-details page-width"
        aria-labelledby="gift-card-details-heading"
      >
        <div className="gift-card-details-heading">
          <p className="eyebrow">A thoughtful gift, made easy</p>
          <h2 id="gift-card-details-heading">Their treat, their choice</h2>
        </div>

        <ol className="gift-card-highlights">
          {giftCardHighlights.map((highlight, index) => (
            <li key={highlight.title}>
              <span className="gift-card-highlight-number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{highlight.title}</h3>
              <p>{highlight.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="gift-card-help page-width"
        aria-labelledby="gift-card-help-heading"
      >
        <div>
          <p className="eyebrow">Need a little help?</p>
          <h2 id="gift-card-help-heading">We’re happy to help</h2>
        </div>
        <p>
          Have a question before you buy? Call Diana on{' '}
          <a href="tel:+353852867059">085 286 7059</a> or{' '}
          <a href="mailto:denizzza1@gmail.com">send an email</a>.
        </p>
      </section>
    </main>
  );
}
