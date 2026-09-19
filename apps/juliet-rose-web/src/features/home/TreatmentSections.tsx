import {
  BOOKING_URL,
  featuredTreatments,
  treatmentCategories,
} from './content';
import { TreatmentSectionLink } from './TreatmentSectionLink';

export function TreatmentSections() {
  return (
    <>
      <section
        className="treatments-section"
        id="treatments"
        aria-labelledby="treatments-heading"
      >
        <div className="page-width">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Our treatments</p>
              <h2 id="treatments-heading">Find the right treatment for you</h2>
            </div>
            <TreatmentSectionLink />
          </div>

          <div className="category-grid">
            {treatmentCategories.map((category) => (
              <a
                className="category-card"
                href={category.href}
                key={category.name}
              >
                <img
                  src={category.image}
                  alt=""
                  width="1536"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
                <div className="category-copy">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <span className="category-link" aria-hidden="true">
                    {category.action}{' '}
                    <span className="icon-arrow" aria-hidden="true" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section
        className="featured-section"
        id="featured"
        aria-labelledby="featured-heading"
      >
        <div className="page-width">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Popular choices</p>
              <h2 id="featured-heading">Featured treatments</h2>
            </div>
            <TreatmentSectionLink />
          </div>

          <div className="featured-grid">
            {featuredTreatments.map((treatment) => (
              <a
                className="treatment-card"
                href={`${BOOKING_URL}?service=${treatment.slug}`}
                key={treatment.name}
              >
                <img
                  src={treatment.image}
                  alt={treatment.imageAlt}
                  width="1536"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
                <div className="treatment-copy">
                  <h3>{treatment.name}</h3>
                  <div className="treatment-meta">
                    <span className="duration">
                      <span className="icon-clock" aria-hidden="true" />
                      {treatment.duration}
                    </span>
                    <strong>{treatment.price}</strong>
                  </div>
                  <span className="primary-button" aria-hidden="true">
                    Book now <span className="icon-arrow" aria-hidden="true" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
