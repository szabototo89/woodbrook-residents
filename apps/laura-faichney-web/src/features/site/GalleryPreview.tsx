import { Eyebrow } from './Eyebrow';
import { Arrow } from './Arrow';
import { GalleryImage } from './GalleryImage';
import { galleryImages } from './siteContent';
import { galleryPhotoPath } from './galleryContent';

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
          {galleryImages.map((image) => (
            <a
              href={galleryPhotoPath(image)}
              key={image.id}
              aria-label={`View gallery: ${image.alt}`}
            >
              <GalleryImage image={image} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
