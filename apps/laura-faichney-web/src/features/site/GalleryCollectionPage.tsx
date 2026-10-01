import { ArrowLeft } from 'lucide-react';
import { GalleryBreadcrumbs } from './GalleryBreadcrumbs';
import { PageHero } from './PageHero';
import { CollectionPictures } from './CollectionPictures';
import { galleryHeroSrcSet } from './galleryImageSources';
import type { CmsGalleryCollection } from './lauraSanity';

export function GalleryCollectionPage(props: {
  collection: CmsGalleryCollection;
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
        imageSrcSet={galleryHeroSrcSet(
          '/artwork/gallery-detail-hero-cutout.webp',
        )}
        imageSizes="(max-width: 640px) 160px, (max-width: 900px) calc((100vw - 48px) / 2), (max-width: 1328px) calc((100vw - 48px) * .58), 742px"
        imagePriority="auto"
        imageAlt="A pink peony painting on a wooden easel beside a cup of paintbrushes"
        action={
          <a className="text-link" href="/gallery">
            <ArrowLeft size={18} aria-hidden="true" /> Back to gallery
          </a>
        }
      />
      <CollectionPictures
        key={props.collection.slug}
        images={props.collection.photos}
      />
    </main>
  );
}
