import { GIFT_CARD_URL } from './content';

export function StudioSections() {
  return (
    <>
      <section
        className="gift-section"
        id="gift-cards"
        aria-labelledby="gift-heading"
      >
        <div className="gift-visual" aria-hidden="true" />
        <div className="gift-copy">
          <p className="eyebrow">Gift cards</p>
          <h2 id="gift-heading">The perfect gift</h2>
          <p>
            Treat someone special to a Juliet Rose gift card.
            <br />
            Available for any treatment or amount.
          </p>
        </div>
        <a className="secondary-button" href={GIFT_CARD_URL}>
          Buy a gift card <span className="icon-arrow" aria-hidden="true" />
        </a>
      </section>

      <section
        className="visit-section"
        id="contact"
        aria-labelledby="visit-heading"
      >
        <div className="visit-copy">
          <p className="eyebrow">Visit us</p>
          <h2 id="visit-heading">Juliet Rose beauty studio</h2>
          <p className="address">
            10 Merville road, Stillorgan, Dublin, Ireland, A94YV78
          </p>

          <div className="contact-row">
            <span className="contact-item opening-hours">
              <span className="icon-clock" aria-hidden="true" />
              <span>
                Monday – Friday
                <br />
                10.00am – 8.00pm
              </span>
            </span>
            <a className="contact-item" href="tel:+353852867059">
              <span className="icon-phone" aria-hidden="true" /> 0852867059
            </a>
            <a className="contact-item" href="mailto:denizzza1@gmail.com">
              <span className="icon-email" aria-hidden="true" />{' '}
              denizzza1@gmail.com
            </a>
            <a
              className="primary-button contact-button"
              href="mailto:denizzza1@gmail.com"
            >
              Contact Diana <span className="icon-arrow" aria-hidden="true" />
            </a>
            <a className="policy-link contact-policy" href="#booking-policy">
              <span className="booking-icon" aria-hidden="true" /> Booking
              policy
            </a>
          </div>
        </div>
        <img
          className="studio-image"
          src="/images/studio-interior.jpg"
          alt="The warm and private Juliet Rose treatment studio"
          width="1536"
          height="1024"
          loading="lazy"
          decoding="async"
        />
      </section>

      <section
        className="booking-policy"
        id="booking-policy"
        aria-labelledby="policy-heading"
      >
        <div>
          <p className="eyebrow">Before your appointment</p>
          <h2 id="policy-heading">Booking policy</h2>
        </div>
        <p>
          Please arrive on time and attend your appointment alone. If you need
          to cancel or rearrange, please give at least 24 hours’ notice. Late
          cancellations and no-shows may be charged.
        </p>
        <a href="https://www.julietrosebeauty.com/">Read the full policy</a>
      </section>
    </>
  );
}
