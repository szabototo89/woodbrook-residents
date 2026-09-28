import { galleryImages } from './siteContent';
import { Eyebrow } from './Eyebrow';
import { GalleryImage } from './GalleryImage';
import { ContactSection } from './ContactSection';

export function GalleryPage() {
  return (
    <main id="main-content">
      <section className="section gallery-page">
        <div className="container">
          <Eyebrow>Gallery</Eyebrow>
          <h1>A glimpse of my work</h1>
          <div className="gallery-grid gallery-page-grid">
            {galleryImages.map((image) => (
              <figure key={image.id}>
                <GalleryImage image={image} />
              </figure>
            ))}
          </div>
        </div>
      </section>
      <ContactSection />
    </main>
  );
}
