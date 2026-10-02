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
        <div className="section-heading centered" data-motion="brush">
          <Eyebrow brush>Creative services</Eyebrow>
          <h2>{props.heading}</h2>
        </div>
        <div className="service-grid">
          {props.services.map((service, index) => (
            <a
              className="service-card"
              href="/services"
              key={service.slug}
              data-motion="card"
              style={{ animationDelay: `${index * 45}ms` }}
            >
              <div className="service-image-frame">
                <ServiceImage
                  sizes="(max-width: 640px) 106px, (max-width: 900px) calc((100vw - 84px) / 3), (max-width: 1328px) calc((100vw - 120px) / 5), 242px"
                  image={service.image}
                />
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
