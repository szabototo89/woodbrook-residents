import { Eyebrow } from './Eyebrow';
import { Arrow } from './Arrow';
import { botanical } from './siteContent';

export function AboutPreview() {
  return (
    <section className="section about-preview">
      <div className="container about-preview-inner">
        <div className="about-art">
          <img
            src={botanical}
            alt="Pink painted flower and foliage"
            width="1254"
            height="1254"
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
      </div>
    </section>
  );
}
