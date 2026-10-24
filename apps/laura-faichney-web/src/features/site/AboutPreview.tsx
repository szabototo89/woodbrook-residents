import { sanityImageSrcSet } from './galleryImageSources';
import { Eyebrow } from './Eyebrow';
import { Arrow } from './Arrow';
import type { HomeData } from './lauraSanity';

type AboutPreviewProps = { about: HomeData['about'] };

export function AboutPreview(props: AboutPreviewProps) {
  const { about } = props;
  return (
    <section className="section about-preview">
      <div className="container about-preview-inner" data-motion="composition">
        <div className="about-art">
          <img
            src={about.image.url}
            srcSet={
              about.image.srcSet ??
              sanityImageSrcSet(about.image.url, [320, 480, 640, 768, 960])
            }
            sizes="(max-width: 640px) calc((100vw - 56px) / 2), (max-width: 1328px) calc((100vw - 48px) * .272), 348px"
            decoding="async"
            alt={about.image.alt}
            width="1448"
            height="1086"
            loading="lazy"
          />
        </div>
        <div className="about-copy">
          <Eyebrow>About Laura</Eyebrow>
          <h2>{about.heading}</h2>
          <p>{about.copy}</p>
          <a className="button button-primary" href="/about">
            More About Laura <Arrow />
          </a>
        </div>
        <img
          className="about-motto"
          src="/decoration/brighter-world-motto.webp"
          srcSet="/decoration/brighter-world-motto-230.webp 230w, /decoration/brighter-world-motto-400.webp 400w, /decoration/brighter-world-motto.webp 460w"
          sizes="(max-width: 640px) 200px, 230px"
          alt="A brighter world through art"
          width="1247"
          height="1261"
          loading="lazy"
        />
      </div>
    </section>
  );
}
