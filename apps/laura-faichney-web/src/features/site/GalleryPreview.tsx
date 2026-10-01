import { Eyebrow } from './Eyebrow';
import { Arrow } from './Arrow';
import { GalleryCollections } from './GalleryCollections';

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
        <GalleryCollections />
      </div>
    </section>
  );
}
