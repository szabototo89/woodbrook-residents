import { galleryImages } from './siteContent';
import { GalleryImage } from './GalleryImage';
import { ContactSection } from './ContactSection';
import { PageHero } from './PageHero';
import { galleryPhotoPath } from './galleryContent';

export function GalleryPage() {
  return (
    <main id="main-content">
      <PageHero
        className="gallery-hero"
        eyebrow="Gallery"
        title="A glimpse of my work"
        description="Explore a selection of colourful paintings and creative work."
        image="/artwork/gallery-hero-cutout.webp"
        imageAlt="A collection of colourful paintings featuring a flower, a cow, and a coastal scene"
      />
      <section className="section gallery-page">
        <div className="container">
          <div className="gallery-grid gallery-page-grid">
            {galleryImages.map((image) => (
              <a
                key={image.id}
                href={galleryPhotoPath(image)}
                aria-label={`View picture: ${image.alt}`}
              >
                <figure>
                  <GalleryImage image={image} />
                  <figcaption>{image.title}</figcaption>
                </figure>
              </a>
            ))}
          </div>
        </div>
      </section>
      <ContactSection />
    </main>
  );
}
