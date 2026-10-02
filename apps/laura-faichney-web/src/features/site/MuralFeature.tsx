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
          srcSet={sanityImageSrcSet(mural.image.url, [320, 480, 640, 768, 960])}
          sizes="(max-width: 640px) 110vw, (max-width: 1328px) 65vw, 830px"
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
