import { galleryCollections } from './siteContent';
import { galleryCollectionPath } from './galleryContent';
import { GalleryImage } from './GalleryImage';

export function GalleryCollections(props: { eager?: boolean }) {
  return (
    <div className="gallery-grid gallery-collections">
      {galleryCollections.map((collection) => (
        <a
          key={collection.slug}
          href={galleryCollectionPath(collection)}
          data-gallery-collection={collection.slug}
          aria-label={`View collection: ${collection.title}`}
        >
          <figure>
            <GalleryImage
              image={collection.images[0]}
              loading={props.eager ? 'eager' : 'lazy'}
            />
            <figcaption>{collection.title}</figcaption>
          </figure>
        </a>
      ))}
    </div>
  );
}
