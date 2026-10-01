import { GalleryCollections } from './GalleryCollections';
import { ContactSection } from './ContactSection';
import { PageHero } from './PageHero';

export function GalleryPage() {
  return (
    <main id="main-content">
      <PageHero
        className="gallery-hero"
        eyebrow="Gallery"
        title="A glimpse of my work"
        description="Explore collections of colour and creative inspiration."
        image="/artwork/gallery-hero-cutout.webp"
        imageAlt="A collection of colourful paintings featuring a flower, a cow, and a coastal scene"
      />
      <section className="section gallery-page">
        <div className="container">
          <GalleryCollections />
        </div>
      </section>
      <ContactSection />
    </main>
  );
}
