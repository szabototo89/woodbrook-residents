import { GoldStroke } from './GoldStroke';
import { Arrow } from './Arrow';
import { ServicesPreview } from './ServicesPreview';
import { MuralFeature } from './MuralFeature';
import { GalleryPreview } from './GalleryPreview';
import { AboutPreview } from './AboutPreview';
import { ContactSection } from './ContactSection';

export function HomePage() {
  return (
    <main id="main-content">
      <section className="hero home-hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="hero-kicker">
              Bold art · brighter spaces · happier people
            </p>
            <h1>
              Bold Art
              <br />
              Brighter Spaces
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
      <ContactSection />
    </main>
  );
}
