import { ArrowLeft, ArrowRight, Leaf } from 'lucide-react';
import { SiteHeader } from '../../components/SiteHeader';
import { guides } from './blogContent';

export function BlogPage() {
  return (
    <div className="site-shell blog-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader page="blog" />
      <main id="main-content" tabIndex={-1}>
        <section
          className="blog-intro content-inset"
          aria-labelledby="blog-title"
        >
          <a className="back-link text-link" href="/">
            <ArrowLeft size={15} aria-hidden="true" />
            Back to home
          </a>
          <p className="eyebrow">The Locale journal</p>
          <h1 id="blog-title">
            Small ideas.
            <br /> A stronger online presence.
          </h1>
          <p>
            Friendly, practical guides to websites, local search and keeping
            your business looking its best online.
          </p>
        </section>
        <section
          className="blog-guides content-inset"
          aria-label="Business website guides"
        >
          {guides.map((guide, index) => (
            <article
              className={
                index === 0 ? 'guide-card featured-guide' : 'guide-card'
              }
              key={guide.id}
              id={guide.id}
            >
              {index === 0 ? (
                <img
                  className="guide-image"
                  src="/images/laura-website-1200.webp"
                  width={1200}
                  height={800}
                  alt="Laura Faichney’s colourful homepage shown on a laptop"
                />
              ) : (
                <div className="guide-icon" aria-hidden="true">
                  <Leaf size={30} strokeWidth={1.3} />
                </div>
              )}
              <div className="guide-copy">
                <p className="eyebrow">{guide.category}</p>
                <h2>{guide.title}</h2>
                <p>{guide.excerpt}</p>
                <details>
                  <summary>
                    {guide.action} <ArrowRight size={15} aria-hidden="true" />
                  </summary>
                  <div className="guide-body">
                    {guide.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    <p className="guide-source">
                      Further reading:{' '}
                      <a href={guide.source.url}>{guide.source.title}</a>
                      <span>Source checked {guide.source.accessed}.</span>
                    </p>
                  </div>
                </details>
              </div>
            </article>
          ))}
        </section>
        <section
          className="blog-contact panel"
          aria-labelledby="blog-contact-title"
        >
          <div>
            <p className="eyebrow">A helping hand</p>
            <h2 id="blog-contact-title">
              Ready to put your ideas into action?
            </h2>
            <p>
              Let’s talk about what your website could do for your business.
            </p>
          </div>
          <a className="button" href="/#contact">
            Get Started <ArrowRight size={16} aria-hidden="true" />
          </a>
        </section>
      </main>
      <footer className="site-footer">
        <span>Locale · Websites for local businesses</span>
        <a href="/">Back to Locale home</a>
      </footer>
    </div>
  );
}
