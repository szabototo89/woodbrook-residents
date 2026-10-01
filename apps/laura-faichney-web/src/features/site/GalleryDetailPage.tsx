import { ArrowLeft, ArrowRight } from 'lucide-react';
import { GalleryBreadcrumbs } from './GalleryBreadcrumbs';
import { GalleryImage } from './GalleryImage';
import { PageHero } from './PageHero';
import { Eyebrow } from './Eyebrow';
import { galleryPhotoPath, type GalleryPhotoDetail } from './galleryContent';

export function GalleryDetailPage(props: { photo: GalleryPhotoDetail }) {
  const { image, index, total, previous, next } = props.photo;
  const description = image.description?.trim();

  return (
    <main id="main-content">
      <GalleryBreadcrumbs title={image.title} />
      <PageHero
        className="gallery-detail-hero"
        eyebrow="A closer look"
        title={image.title}
        description="Take a moment to explore the colours and little details."
        image="/artwork/gallery-detail-hero-cutout.webp"
        imageAlt="A pink peony painting on a wooden easel beside a cup of paintbrushes"
        action={
          <a className="text-link" href="/gallery">
            <ArrowLeft size={18} aria-hidden="true" /> Back to gallery
          </a>
        }
      />
      <section className="section gallery-detail" aria-label="Picture detail">
        <div className="container">
          <div className="gallery-detail-layout">
            <figure className="gallery-detail-picture">
              <img
                src={`/artwork/picsum-${image.id}.webp`}
                alt={image.alt}
                width="640"
                height="480"
              />
            </figure>
            <div className="gallery-detail-copy">
              <Eyebrow>In the gallery</Eyebrow>
              <p className="gallery-position">
                Picture {index + 1} of {total}
              </p>
              {description && (
                <section aria-labelledby="picture-description-title">
                  <h2 id="picture-description-title">About this picture</h2>
                  <p>{description}</p>
                </section>
              )}
            </div>
          </div>
          <nav className="picture-navigation" aria-label="Picture navigation">
            <a href={galleryPhotoPath(previous)} rel="prev">
              <GalleryImage image={previous} />
              <span>
                <span className="picture-direction">
                  <ArrowLeft size={18} aria-hidden="true" />
                  Previous picture
                </span>
                <span className="picture-title">{previous.title}</span>
              </span>
            </a>
            <a href={galleryPhotoPath(next)} rel="next">
              <span>
                <span className="picture-direction">
                  Next picture
                  <ArrowRight size={18} aria-hidden="true" />
                </span>
                <span className="picture-title">{next.title}</span>
              </span>
              <GalleryImage image={next} />
            </a>
          </nav>
        </div>
      </section>
    </main>
  );
}
