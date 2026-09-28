import { Eyebrow } from './Eyebrow';
import { Arrow } from './Arrow';
import { ServiceImage } from './ServiceImage';
import { services } from './siteContent';

export function GalleryPreview() {
  return (
    <section className="section gallery-preview" id="gallery">
      <div className="container">
        <div className="gallery-heading">
          <div>
            <Eyebrow>Gallery</Eyebrow>
            <h2>A glimpse of my work</h2>
          </div>
          <a className="text-link" href="/gallery">
            View full gallery <Arrow />
          </a>
        </div>
        <div className="gallery-grid">
          {services.map((service) => (
            <a
              href="/gallery"
              key={service.title}
              aria-label={`View ${service.title} artwork in gallery`}
            >
              <ServiceImage service={service} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
