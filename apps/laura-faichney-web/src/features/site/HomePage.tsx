import { GoldStroke } from './GoldStroke';
import { Arrow } from './Arrow';
import { ServicesPreview } from './ServicesPreview';
import { MuralFeature } from './MuralFeature';
import { GalleryPreview } from './GalleryPreview';
import { AboutPreview } from './AboutPreview';
import { ContactSection } from './ContactSection';
import { Testimonial } from './Testimonial';
import { useEditorialMotion } from './useEditorialMotion';

export function HomePage() {
  const motionRoot = useEditorialMotion();
  return (
    <main id="main-content" ref={motionRoot}>
      <section className="hero home-hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="hero-kicker">
              Bold art · brighter spaces · happier people
            </p>
            <h1>
              <span className="hero-line">Bold Art</span>
              <br />
              <span className="hero-line">Brighter Spaces</span>
            </h1>
            <GoldStroke />
            <p>
              Commissioned paintings, murals, signage, facepainting and art
              tutoring — bringing more colour and creativity to everyday spaces.
            </p>
            <a className="button button-primary" href="/gallery">
              View My Work <Arrow />
            </a>
          </div>
          <div className="hero-art">
            <img
              src="/artwork/portrait-cutout.png"
              alt="Expressive painted portrait in vivid pink, blue, orange and yellow"
              width="1374"
              height="1145"
              fetchPriority="high"
            />
          </div>
        </div>
      </section>
      <ServicesPreview />
      <MuralFeature />
      <GalleryPreview />
      <AboutPreview />
      <Testimonial />
      <ContactSection />
    </main>
  );
}
