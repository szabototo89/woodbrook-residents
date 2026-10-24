import { Arrow } from './Arrow';
import { GalleryImage } from './GalleryImage';
import {
  galleryCollectionPath,
  type CmsGalleryCollection,
} from './lauraSanity';

type GalleryCollectionsProps = {
  collections: CmsGalleryCollection[];
  eager?: boolean;
};

export function GalleryCollections(props: GalleryCollectionsProps) {
  return (
    <div className="gallery-grid gallery-collections">
      {props.collections.map((collection) => {
        const cover = collection.photos[0];
        if (!cover) return null;
        return (
          <a
            key={collection.slug}
            href={galleryCollectionPath(collection)}
            data-gallery-collection={collection.slug}
            aria-label={`View collection: ${collection.title}`}
          >
            <figure>
              <GalleryImage
                src={cover.image.url}
                srcSet={cover.image.srcSet}
                alt={cover.alt}
                loading={props.eager ? 'eager' : 'lazy'}
              />
              <figcaption>
                {collection.title}
                <Arrow />
              </figcaption>
            </figure>
          </a>
        );
      })}
    </div>
  );
}
