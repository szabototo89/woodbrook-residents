import { Eyebrow } from './Eyebrow';
import { Arrow } from './Arrow';
import { ServiceImage } from './ServiceImage';
import type { CmsService } from './lauraSanity';

export function ServicesPreview(props: {
  services: CmsService[];
  heading: string;
}) {
  return (
    <section className="section services-preview" id="services">
      <div className="container">
        <div className="section-heading centered">
          <Eyebrow>Creative services</Eyebrow>
          <h2>{props.heading}</h2>
        </div>
        <div className="service-grid" data-motion="services">
          {props.services.map((service, index) => (
            <a
              className="service-card"
              href="/services"
              key={service.slug}
              style={{
                animationDelay: `calc(${index} * var(--motion-stagger))`,
              }}
            >
              <div className="service-image-frame">
                <ServiceImage image={service.image} />
              </div>
              <span>
                {service.title}
                <Arrow />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
