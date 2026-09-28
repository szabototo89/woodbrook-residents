import { services } from './siteContent';
import { Eyebrow } from './Eyebrow';
import { ServiceImage } from './ServiceImage';
import { ContactSection } from './ContactSection';

export function GalleryPage() {
  return (
    <main id="main-content">
      <section className="section gallery-page">
        <div className="container">
          <Eyebrow>Gallery</Eyebrow>
          <h1>A glimpse of my work</h1>
          <p className="gallery-intro">
            A selection of the colourful artwork and creative services that
            shape this site.
          </p>
          <div className="gallery-grid gallery-page-grid">
            {services.map((service) => (
              <figure key={service.title}>
                <ServiceImage service={service} />
                <figcaption>{service.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <ContactSection />
    </main>
  );
}
