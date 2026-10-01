import { GalleryCollections } from './GalleryCollections';
import { ContactSection } from './ContactSection';
import { PageHero } from './PageHero';
import { TitleLines } from './TitleLines';
import type { GalleryData } from './lauraSanity';

export function GalleryPage(props: { data: GalleryData }) {
  const { data } = props;
  return (
    <main id="main-content">
      <PageHero
        className="gallery-hero"
        eyebrow={data.hero.eyebrow}
        title={<TitleLines lines={data.hero.titleLines} />}
        description={data.hero.description}
        image={data.hero.image.url}
        imageAlt={data.hero.image.alt}
      />
      <section className="section gallery-page">
        <div className="container">
          <GalleryCollections collections={data.collections} />
        </div>
      </section>
      <ContactSection settings={data.settings} />
    </main>
  );
}
