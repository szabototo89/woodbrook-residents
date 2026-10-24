import { heroImageSrcSet } from './heroImageSources';
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
import { HomeAnnouncement } from './HomeAnnouncement';

type HomePageProps = { data: HomeData };

export function HomePage(props: HomePageProps) {
  const { data } = props;
  const motionRoot = useEditorialMotion();
  return (
    <main id="main-content" ref={motionRoot}>
      {data.announcement && (
        <HomeAnnouncement announcement={data.announcement} />
      )}
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
            <picture>
              {(data.hero.image.avifSrcSet ??
                heroImageSrcSet(data.hero.image.url, 'avif')) && (
                <source
                  type="image/avif"
                  srcSet={
                    data.hero.image.avifSrcSet ??
                    heroImageSrcSet(data.hero.image.url, 'avif')
                  }
                  sizes="(max-width: 640px) 100vw, (max-width: 1328px) 61vw, 805px"
                />
              )}
              <img
                src={data.hero.image.url}
                srcSet={
                  data.hero.image.srcSet ?? heroImageSrcSet(data.hero.image.url)
                }
                sizes="(max-width: 640px) 100vw, (max-width: 1328px) 61vw, 805px"
                decoding="async"
                alt={data.hero.image.alt}
                width="1374"
                height="1145"
                fetchPriority="high"
              />
            </picture>
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
