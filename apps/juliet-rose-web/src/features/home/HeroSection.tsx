import { BOOKING_URL } from './content';

export function HeroSection() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-heading">
      <img
        className="hero-image"
        src="/images/facial-hero.jpg"
        alt="A relaxing facial treatment at Juliet Rose Beauty Studio"
        width="1774"
        height="887"
        fetchPriority="high"
      />
      <div className="hero-wash" aria-hidden="true" />
      <div className="hero-inner page-width">
        <p className="eyebrow">
          Beauty&nbsp; · &nbsp;Wellbeing&nbsp; · &nbsp;You
        </p>
        <h1 id="hero-heading">Relax and Revitalize</h1>
        <p className="hero-location">
          Beauty treatments in Stillorgan, South Dublin.
        </p>
        <p className="hero-copy">
          A wide range of beauty treatments and products, <br />
          all in one place.
        </p>
        <div className="hero-actions">
          <a className="primary-button" href={BOOKING_URL}>
            Book an appointment{' '}
            <span className="icon-arrow" aria-hidden="true" />
          </a>
          <a className="secondary-button" href="#treatments">
            View treatments
          </a>
        </div>
        <a className="policy-link" href="#booking-policy">
          <span className="booking-icon" aria-hidden="true" /> Booking policy
        </a>
      </div>
    </section>
  );
}
