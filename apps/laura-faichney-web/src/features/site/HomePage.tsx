import { GoldStroke } from './GoldStroke';
import { Arrow } from './Arrow';
import { ServicesPreview } from './ServicesPreview';
import { MuralFeature } from './MuralFeature';
import { GalleryPreview } from './GalleryPreview';
import { AboutPreview } from './AboutPreview';
import { ContactSection } from './ContactSection';
import { Testimonial } from './Testimonial';
import { useEditorialMotion } from './useEditorialMotion';
import { TitleLines } from './TitleLines';
import type { HomeData } from './lauraSanity';

export function HomePage(props: { data: HomeData }) {
  const { data } = props;
  const motionRoot = useEditorialMotion();
  return (
    <main id="main-content" ref={motionRoot}>
      <section className="hero home-hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="hero-kicker">{data.hero.eyebrow}</p>
            <h1>
              <TitleLines
                lines={data.hero.titleLines}
                lineClassName="hero-line"
              />
            </h1>
            <GoldStroke />
            <p>{data.hero.description}</p>
            <a className="button button-primary" href="/gallery">
              {data.hero.ctaLabel ?? 'View My Work'} <Arrow />
            </a>
          </div>
          <div className="hero-art">
            <img
              src={data.hero.image.url}
              alt={data.hero.image.alt}
              width="1374"
              height="1145"
              fetchPriority="high"
            />
          </div>
        </div>
      </section>
      <ServicesPreview
        services={data.services}
        heading={data.servicesHeading}
      />
      <MuralFeature mural={data.mural} />
      <GalleryPreview
        collections={data.collections}
        heading={data.galleryHeading}
      />
      <AboutPreview about={data.about} />
      <Testimonial testimonial={data.testimonial} />
      <ContactSection settings={data.settings} />
    </main>
  );
}
