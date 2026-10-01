import { GalleryImage } from './GalleryImage';
import {
  galleryCollectionPath,
  type CmsGalleryCollection,
} from './lauraSanity';

export function GalleryCollections(props: {
  collections: CmsGalleryCollection[];
}) {
  return (
    <div className="gallery-grid gallery-collections">
      {props.collections.map((collection) => {
        const cover = collection.photos[0];
        if (!cover) return null;
        return (
          <a
            key={collection.slug}
            href={galleryCollectionPath(collection)}
            aria-label={`View collection: ${collection.title}`}
          >
            <figure>
              <GalleryImage src={cover.image.url} alt={cover.alt} />
              <figcaption>{collection.title}</figcaption>
            </figure>
          </a>
        );
      })}
    </div>
  );
}
