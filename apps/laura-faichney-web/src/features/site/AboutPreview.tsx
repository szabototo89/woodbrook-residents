import { Eyebrow } from './Eyebrow';
import { Arrow } from './Arrow';
import type { HomeData } from './lauraSanity';

export function AboutPreview(props: { about: HomeData['about'] }) {
  const { about } = props;
  return (
    <section className="section about-preview">
      <div className="container about-preview-inner">
        <div className="about-art" data-motion="photo">
          <img
            src={about.image.url}
            alt={about.image.alt}
            width="1448"
            height="1086"
            loading="lazy"
          />
        </div>
        <div className="about-copy" data-motion="copy">
          <Eyebrow>About Laura</Eyebrow>
          <h2>{about.heading}</h2>
          <p>{about.copy}</p>
          <a className="button button-primary" href="/about">
            More About Laura <Arrow />
          </a>
        </div>
        <img
          className="about-motto"
          src="/decoration/brighter-world-motto.png"
          alt="A brighter world through art"
          width="1247"
          height="1261"
          loading="lazy"
        />
      </div>
    </section>
  );
}
