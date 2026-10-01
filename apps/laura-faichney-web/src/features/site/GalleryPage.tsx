import { GalleryImage } from './GalleryImage';
import { ContactSection } from './ContactSection';
import { PageHero } from './PageHero';
import { TitleLines } from './TitleLines';
import { galleryPhotoPath, type GalleryData } from './lauraSanity';

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
          <div className="gallery-grid gallery-page-grid">
            {data.items.map((item) => (
              <a
                key={item.slug}
                href={galleryPhotoPath(item)}
                aria-label={`View picture: ${item.alt}`}
              >
                <figure>
                  <GalleryImage src={item.image.url} alt={item.alt} />
                  <figcaption>{item.title}</figcaption>
                </figure>
              </a>
            ))}
          </div>
        </div>
      </section>
      <ContactSection settings={data.settings} />
    </main>
  );
}
