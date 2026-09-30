import { Heart, MapPin, Palette, Sparkles } from 'lucide-react';
import { portrait } from './siteContent';
import { Arrow } from './Arrow';
import { ContactSection } from './ContactSection';
import { GoldStroke } from './GoldStroke';
import { PageHero } from './PageHero';

export function AboutPage() {
  return (
    <main id="main-content">
      <PageHero
        className="about-hero"
        eyebrow="About Laura"
        title={
          <>
            A love for art
            <br />
            and community
          </>
        }
        description="I’m Laura Faichney, an artist based in Ireland, creating colourful paintings, murals and bespoke pieces for homes, businesses and events. I also offer facepainting and art tutoring, sharing my passion for creativity with all ages."
        image="/artwork/about-hero-cutout.webp"
        imageAlt="Painted flower study in an open sketchbook with a palette and brushes"
        action={
          <a className="button button-primary" href="/contact">
            Get in Touch <Arrow />
          </a>
        }
      />
      <section className="values">
        <div className="container values-grid">
          <div>
            <span className="values-icon" aria-hidden="true">
              <Palette size={44} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <h2>
              Creative
              <br />
              &amp; Bespoke
            </h2>
            <p>Artwork tailored for homes, businesses and events.</p>
          </div>
          <div>
            <span className="values-icon" aria-hidden="true">
              <Heart size={44} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <h2>
              All Ages
              <br />
              Welcome
            </h2>
            <p>From children’s facepainting to art tutoring.</p>
          </div>
          <div>
            <span className="values-icon" aria-hidden="true">
              <Sparkles size={44} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <h2>
              Brighter
              <br />
              Spaces
            </h2>
            <p>Art that brings colour and character to everyday spaces.</p>
          </div>
          <div>
            <span className="values-icon" aria-hidden="true">
              <MapPin size={44} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <h2>
              Local &amp;
              <br />
              Community Focused
            </h2>
            <p>Creative work for people and places in Ireland.</p>
          </div>
        </div>
      </section>
      <section className="section story">
        <div className="container story-inner">
          <div>
            <h2>My Story</h2>
            <GoldStroke />
            <p>
              Art has always been a big part of my life. I love how it can
              transform a space, bring people together and create moments of
              joy. Whether it’s a mural, a painting for a home, or a first
              experience with facepainting, my goal is to make everyday spaces a
              little brighter.
            </p>
          </div>
          <img
            src={portrait}
            alt="Colourful painted portrait"
            width="1122"
            height="1402"
            loading="lazy"
          />
        </div>
      </section>
      <ContactSection />
    </main>
  );
}
