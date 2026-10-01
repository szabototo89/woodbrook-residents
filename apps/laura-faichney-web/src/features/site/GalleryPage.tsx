import { GalleryCollections } from './GalleryCollections';
import { ContactSection } from './ContactSection';
import { PageHero } from './PageHero';
import { galleryHeroSrcSet } from './galleryImageSources';

export function GalleryPage() {
  return (
    <main id="main-content">
      <PageHero
        className="gallery-hero"
        eyebrow="Gallery"
        title="A glimpse of my work"
        description="Explore collections of colour and creative inspiration."
        image="/artwork/gallery-hero-cutout.webp"
        imageSrcSet={galleryHeroSrcSet('/artwork/gallery-hero-cutout.webp')}
        imageSizes="(max-width: 640px) 200px, (max-width: 900px) calc((100vw - 48px) / 2), (max-width: 1328px) calc((100vw - 48px) * .58), 742px"
        imageAlt="A collection of colourful paintings featuring a flower, a cow, and a coastal scene"
      />
      <section className="section gallery-page">
        <div className="container">
          <GalleryCollections eager />
        </div>
      </section>
      <ContactSection />
    </main>
  );
}
