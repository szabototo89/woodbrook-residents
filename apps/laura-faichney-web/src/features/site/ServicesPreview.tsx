import { Eyebrow } from './Eyebrow';
import { Arrow } from './Arrow';
import { ServiceImage } from './ServiceImage';
import { services } from './siteContent';

export function ServicesPreview() {
  return (
    <section className="section services-preview" id="services">
      <div className="container">
        <div className="section-heading centered">
          <Eyebrow>Creative services</Eyebrow>
          <h2>Art for Homes, Businesses &amp; Events</h2>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <a className="service-card" href="/services" key={service.title}>
              <ServiceImage service={service} />
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
