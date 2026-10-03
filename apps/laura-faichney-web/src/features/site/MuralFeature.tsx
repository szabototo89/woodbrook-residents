import { sanityImageSrcSet } from './galleryImageSources';
import { Eyebrow } from './Eyebrow';
import { Arrow } from './Arrow';
import type { HomeData } from './lauraSanity';

export function MuralFeature(props: { mural: HomeData['mural'] }) {
  const { mural } = props;
  return (
    <section className="mural-feature" data-motion="mural">
      <div className="container mural-inner">
        <div className="mural-copy">
          <Eyebrow brush>{mural.eyebrow}</Eyebrow>
          <h2>{mural.heading}</h2>
          <p>{mural.copy}</p>
          <a className="button button-secondary" href="/contact">
            {mural.ctaLabel} <Arrow />
          </a>
        </div>
      </div>
      <div className="mural-art">
        <img
          src={mural.image.url}
          srcSet={
            mural.image.srcSet ??
            sanityImageSrcSet(mural.image.url, [320, 480, 640, 768, 960])
          }
          sizes="(max-width: 408px) calc(100vw - 48px), (max-width: 640px) 360px, (max-width: 900px) 49vw, 65vw"
          decoding="async"
          alt={mural.image.alt}
          width="1254"
          height="1254"
          loading="lazy"
        />
      </div>
    </section>
  );
}
