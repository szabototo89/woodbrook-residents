import { sanityImageSrcSet } from './galleryImageSources';
import { Eyebrow } from './Eyebrow';
import { Arrow } from './Arrow';
import type { HomeData } from './lauraSanity';

type MuralFeatureProps = { mural: HomeData['mural'] };

export function MuralFeature(props: MuralFeatureProps) {
  const { mural } = props;
  if (!mural.image.url && !mural.heading && !mural.copy) return null;
  return (
    <section className="mural-feature" data-motion="mural">
      <div className="container mural-inner">
        {mural.image.url && (
          <div className="mural-art">
            <img
              src={mural.image.url}
              srcSet={
                mural.image.srcSet ??
                sanityImageSrcSet(mural.image.url, [320, 480, 640, 768, 960])
              }
              sizes="(max-width: 400px) calc(100vw - 40px), (max-width: 640px) 360px, (max-width: 1328px) 46vw, 608px"
              decoding="async"
              alt={mural.image.alt}
              width="1254"
              height="1254"
              loading="lazy"
            />
          </div>
        )}
        <div className="mural-copy">
          <Eyebrow brush>{mural.eyebrow}</Eyebrow>
          {mural.heading && <h2>{mural.heading}</h2>}
          {mural.copy && <p>{mural.copy}</p>}
          {mural.ctaLabel && (
            <a className="button button-secondary" href="/contact">
              {mural.ctaLabel} <Arrow />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
