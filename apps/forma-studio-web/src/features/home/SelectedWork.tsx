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
      <article className="work-card">
        <a
          className="work-preview"
          href="https://laura-faichney-all-things-art.pages.dev"
          aria-label="Preview Laura Faichney’s live website"
        >
          <div className="work-preview-bar" aria-hidden="true">
            <span className="work-window-dots">
              <span />
              <span />
              <span />
            </span>
            <span>All Things Art</span>
            <ArrowUpRight size={15} />
          </div>
          <img
            src="/images/laura-project.jpg"
            width={1440}
            height={540}
            loading="lazy"
            alt="Laura Faichney’s live website, with its artwork hero and service introduction"
          />
        </a>
        <div className="work-copy">
          <div>
            <p className="eyebrow">Artist website</p>
            <h3>Laura Faichney · All Things Art</h3>
          </div>
          <div className="work-summary">
            <p>
              An art-filled website with a gallery, clear service details and an
              easy way to enquire.
            </p>
            <a
              className="text-link"
              href="https://laura-faichney-all-things-art.pages.dev"
            >
              Visit the website <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
      </article>
    </section>
  );
}
