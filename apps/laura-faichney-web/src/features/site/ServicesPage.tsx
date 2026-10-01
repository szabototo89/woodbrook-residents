import { ArrowRight } from 'lucide-react';
import { services } from './siteContent';
import { PageHero } from './PageHero';
import { ServiceImage } from './ServiceImage';
import { ContactSection } from './ContactSection';

export function ServicesPage() {
  return (
    <main id="main-content">
      <PageHero
        className="services-hero"
        eyebrow="My services"
        title={
          <>
            Art for Every
            <br />
            Space and Occasion
          </>
        }
        description="From bespoke paintings to large-scale murals, facepainting and art tutoring, I offer creative services for homes, businesses and events."
        image="/artwork/services-hero-cutout.webp"
        imageAlt="Paintbrushes in a paint-splashed cup with sweeping colourful brushstrokes"
      />
      <section className="service-list-section">
        <div className="container service-list">
          {services.map((service) => (
            <a
              className="service-list-link"
              href={`/contact?service=${encodeURIComponent(service.title)}`}
              key={service.title}
            >
              <div className="service-image-frame">
                <ServiceImage service={service} />
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
      <ContactSection />
    </main>
  );
}
