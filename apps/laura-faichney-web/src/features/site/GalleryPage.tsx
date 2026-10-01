import { GalleryCollections } from './GalleryCollections';
import { ContactSection } from './ContactSection';
import { PageHero } from './PageHero';
import { galleryHeroSrcSet } from './galleryImageSources';
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
        imageSrcSet={galleryHeroSrcSet(data.hero.image.url)}
        imageSizes="(max-width: 640px) 200px, (max-width: 900px) calc((100vw - 48px) / 2), (max-width: 1328px) calc((100vw - 48px) * .58), 742px"
        imageAlt={data.hero.image.alt}
      />
      <section className="section gallery-page">
        <div className="container">
          <GalleryCollections collections={data.collections} eager />
        </div>
      </section>
      <ContactSection settings={data.settings} />
    </main>
  );
}
