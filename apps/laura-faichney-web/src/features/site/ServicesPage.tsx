import { Arrow } from './Arrow';
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
            src="/decoration/art-brings-people-together.webp"
            srcSet="/decoration/art-brings-people-together-240.webp 240w, /decoration/art-brings-people-together-400.webp 400w, /decoration/art-brings-people-together.webp 600w"
            sizes="(max-width: 1000px) 180px, (max-width: 1333px) 18vw, 240px"
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
                <ServiceImage
                  sizes="(max-width: 640px) 106px, (max-width: 900px) 36vw, 340px"
                  image={service.image}
                />
              </div>
              <div className="service-list-copy">
                <h2>
                  {service.title}
                  <Arrow />
                </h2>
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
