import { ArrowLeft } from 'lucide-react';
import { GalleryBreadcrumbs } from './GalleryBreadcrumbs';
import { PageHero } from './PageHero';
import { CollectionPictures } from './CollectionPictures';
import type { GalleryCollection } from './siteContent';

export function GalleryCollectionPage(props: {
  collection: GalleryCollection;
}) {
  return (
    <main id="main-content">
      <GalleryBreadcrumbs title={props.collection.title} />
      <PageHero
        className="gallery-detail-hero"
        eyebrow="Collection"
        title={props.collection.title}
        description={props.collection.description}
        image="/artwork/gallery-detail-hero-cutout.webp"
        imageAlt="A pink peony painting on a wooden easel beside a cup of paintbrushes"
        action={
          <a className="text-link" href="/gallery">
            <ArrowLeft size={18} aria-hidden="true" />
            Back to gallery
          </a>
        }
      />
      <CollectionPictures
        key={props.collection.slug}
        images={props.collection.images}
      />
    </main>
  );
}
