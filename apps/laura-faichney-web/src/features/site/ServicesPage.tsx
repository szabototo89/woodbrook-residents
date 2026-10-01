import { PageHero } from './PageHero';
import { ServiceImage } from './ServiceImage';
import { ContactSection } from './ContactSection';
import { TitleLines } from './TitleLines';
import { ServicesProcess } from './ServicesProcess';
import { serviceHighlights } from './serviceHighlights';
import type { ServicesData } from './lauraSanity';

export function ServicesPage(props: { data: ServicesData }) {
  const { data } = props;
  return (
    <main id="main-content" className="services-page">
      <PageHero
        className="services-hero"
        eyebrow={data.hero.eyebrow}
        title={<TitleLines lines={data.hero.titleLines} />}
        description={data.hero.description}
        image={data.hero.image.url}
        imageAlt={data.hero.image.alt}
        action={
          <img
            className="services-motto"
            src="/decoration/art-brings-people-together.png"
            alt="Art brings people together"
            width="1448"
            height="1086"
          />
        }
      />
      <section className="service-list-section" aria-label="Creative services">
        <div className="container service-list">
          {data.services.map((service) => (
            <a
              className="service-list-link"
              href={`/contact?service=${encodeURIComponent(service.slug)}`}
              key={service.slug}
            >
              <div className="service-image-frame">
                <ServiceImage image={service.image} />
              </div>
              <div className="service-list-copy">
                <h2>{service.title}</h2>
                <span>{service.description}</span>
                {serviceHighlights[service.slug] && (
                  <ul
                    className="service-highlights"
                    aria-label={`${service.title} options`}
                  >
                    {serviceHighlights[service.slug]?.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            </a>
          ))}
        </div>
      </section>
      <ServicesProcess />
      <ContactSection settings={data.settings} />
    </main>
  );
}
