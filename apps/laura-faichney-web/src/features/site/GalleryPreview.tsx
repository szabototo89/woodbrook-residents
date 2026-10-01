import { Eyebrow } from './Eyebrow';
import { Arrow } from './Arrow';
import { GalleryImage } from './GalleryImage';
import { galleryPhotoPath, type CmsGalleryItem } from './lauraSanity';

export function GalleryPreview(props: {
  items: CmsGalleryItem[];
  heading: string;
}) {
  return (
    <section className="section gallery-preview" id="gallery">
      <div className="container">
        <div className="gallery-heading">
          <div>
            <Eyebrow>Gallery</Eyebrow>
            <h2>{props.heading}</h2>
          </div>
          <a className="text-link" href="/gallery">
            View full gallery <Arrow />
          </a>
        </div>
        <div className="gallery-grid">
          {props.items.map((item) => (
            <a
              href={galleryPhotoPath(item)}
              key={item.slug}
              aria-label={`View gallery: ${item.alt}`}
            >
              <GalleryImage src={item.image.url} alt={item.alt} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
