import { ArrowRight } from 'lucide-react';
import { PageHero } from './PageHero';
import { ServiceImage } from './ServiceImage';
import { ContactSection } from './ContactSection';
import { TitleLines } from './TitleLines';
import type { ServicesData } from './lauraSanity';

export function ServicesPage(props: { data: ServicesData }) {
  const { data } = props;
  return (
    <main id="main-content">
      <PageHero
        className="services-hero"
        eyebrow={data.hero.eyebrow}
        title={<TitleLines lines={data.hero.titleLines} />}
        description={data.hero.description}
        image={data.hero.image.url}
        imageAlt={data.hero.image.alt}
      />
      <section className="service-list-section">
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
              <span className="service-list-copy">
                <strong>{service.title}</strong>
                <span>{service.description}</span>
              </span>
              <span className="service-arrow" aria-hidden="true">
                <ArrowRight size={22} strokeWidth={2} aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
      </section>
      <ContactSection settings={data.settings} />
    </main>
  );
}
