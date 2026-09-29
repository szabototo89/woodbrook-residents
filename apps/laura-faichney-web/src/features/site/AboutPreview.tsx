import { Eyebrow } from './Eyebrow';
import { Arrow } from './Arrow';

export function AboutPreview() {
  return (
    <section className="section about-preview">
      <div className="container about-preview-inner">
        <div className="about-art">
          <img
            src="/artwork/about-studio.webp"
            alt="Paintbrushes, palettes and colourful canvases in an artist’s studio"
            width="1448"
            height="1086"
            loading="lazy"
          />
        </div>
        <div className="about-copy">
          <Eyebrow>About Laura</Eyebrow>
          <h2>Art, colour and people are what inspire me</h2>
          <p>
            Hi, I’m Laura — an artist and creative all-rounder. I love
            transforming spaces with bold, colourful art and helping people
            discover their creativity through painting, facepainting and art
            tutoring.
          </p>
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
