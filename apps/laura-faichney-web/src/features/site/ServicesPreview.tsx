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
        <div className="service-grid">
          {props.services.map((service) => (
            <a className="service-card" href="/services" key={service.slug}>
              <ServiceImage image={service.image} />
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
