import { Eyebrow } from './Eyebrow';
import { Arrow } from './Arrow';
import { GalleryCollections } from './GalleryCollections';
import type { CmsGalleryCollection } from './lauraSanity';

export function GalleryPreview(props: {
  collections: CmsGalleryCollection[];
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
        <GalleryCollections collections={props.collections} />
      </div>
    </section>
  );
}
