import { Eyebrow } from './Eyebrow';
import { Arrow } from './Arrow';
import { GalleryCollections } from './GalleryCollections';
import {
  selectHomeGalleryCollections,
  type CmsGalleryCollection,
} from './lauraSanity';

type GalleryPreviewProps = {
  collections: CmsGalleryCollection[];
  heading: string;
};

export function GalleryPreview(props: GalleryPreviewProps) {
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
        <GalleryCollections
          collections={selectHomeGalleryCollections(props.collections)}
        />
      </div>
    </section>
  );
}
