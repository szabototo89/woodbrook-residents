import { ArrowUpRight } from 'lucide-react';

export function SelectedWork() {
  return (
    <section
      className="selected-work content-inset"
      id="work"
      aria-labelledby="work-title"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">Selected work</p>
          <h2 id="work-title">A website in the wild</h2>
        </div>
        <p>Explore the experience for yourself</p>
      </div>
      <article className="work-card panel">
        <img
          src="/images/laura-project.jpg"
          width={1440}
          height={540}
          loading="lazy"
          alt="Laura Faichney’s live website, with its artwork hero and service introduction"
        />
        <div className="work-copy">
          <p className="eyebrow">Artist website</p>
          <h3>Laura Faichney · All Things Art</h3>
          <p>
            A colourful home for an artist’s work, with artwork collections,
            service details and a direct enquiry path.
          </p>
          <ul className="work-tags" aria-label="Website features">
            <li>Artwork gallery</li>
            <li>Service information</li>
            <li>Mobile layouts</li>
          </ul>
          <a
            className="text-link"
            href="https://laura-faichney-all-things-art.pages.dev"
          >
            Visit the website <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <p className="work-note">
            Website preview captured October 2026. Explore the live site for the
            latest work.
          </p>
        </div>
      </article>
    </section>
  );
}
