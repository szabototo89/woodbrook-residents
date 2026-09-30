import { ArrowRight } from 'lucide-react';
import { services, servicesHero } from './siteContent';
import { Eyebrow } from './Eyebrow';
import { GoldStroke } from './GoldStroke';
import { ServiceImage } from './ServiceImage';
import { ContactSection } from './ContactSection';

export function ServicesPage() {
  return (
    <main id="main-content">
      <section className="page-hero services-hero">
        <div className="container page-hero-inner">
          <div className="page-hero-copy">
            <Eyebrow>My services</Eyebrow>
            <h1>
              Art for Every
              <br />
              Space and Occasion
            </h1>
            <GoldStroke />
            <p>
              From bespoke paintings to large-scale murals, facepainting and art
              tutoring, I offer creative services for homes, businesses and
              events.
            </p>
          </div>
          <img
            src={servicesHero}
            alt="Paintbrushes in a painted cup with pink, gold and navy brushstrokes"
            width="1536"
            height="1024"
            fetchPriority="high"
          />
        </div>
      </section>
      <section className="service-list-section">
        <div className="container service-list">
          {services.map((service) => (
            <a
              className="service-list-link"
              href={`/contact?service=${encodeURIComponent(service.title)}`}
              key={service.title}
            >
              <ServiceImage service={service} />
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
      <ContactSection />
    </main>
  );
}
