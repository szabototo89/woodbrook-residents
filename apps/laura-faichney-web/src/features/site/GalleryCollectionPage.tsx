import { ArrowLeft } from 'lucide-react';
import { GalleryBreadcrumbs } from './GalleryBreadcrumbs';
import { Eyebrow } from './Eyebrow';
import { GoldStroke } from './GoldStroke';
import { CollectionPictures } from './CollectionPictures';
import type { CmsGalleryCollection } from './lauraSanity';

export function GalleryCollectionPage(props: {
  collection: CmsGalleryCollection;
}) {
  return (
    <main id="main-content">
      <GalleryBreadcrumbs title={props.collection.title} />
      <div className="container collection-detail-layout">
        <div className="collection-introduction">
          <Eyebrow>Collection</Eyebrow>
          <h1>{props.collection.title}</h1>
          <GoldStroke />
          <p>{props.collection.description}</p>
          <a className="text-link" href="/gallery">
            <ArrowLeft size={18} aria-hidden="true" /> Back to gallery
          </a>
        </div>
        <CollectionPictures
          key={props.collection.slug}
          images={props.collection.photos}
        />
      </div>
    </main>
  );
}
