import { Fragment } from 'react';
import { ArrowLeft, ArrowRight, Leaf } from 'lucide-react';
import { SiteHeader } from '../../components/SiteHeader';
import { Card } from '../../components/Card';
import { content } from '../content/content';

export function BlogPage() {
  const { journal, settings } = content;
  const { guides } = journal;
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
            {journal.backLabel}
          </a>
          <p className="eyebrow">{journal.eyebrow}</p>
          <h1 id="blog-title">
            {journal.title.map((line, index) => (
              <Fragment key={line}>
                {index > 0 && (
                  <>
                    {' '}
                    <br />
                  </>
                )}
                {line}
              </Fragment>
            ))}
          </h1>
          <p>{journal.description}</p>
        </section>
        <section
          className="blog-guides content-inset"
          aria-label={journal.guidesLabel}
        >
          {guides.map((guide, index) => (
            <Card
              as="article"
              variant="muted"
              padding={index === 0 ? 'none' : 'md'}
              className={
                index === 0 ? 'guide-card featured-guide' : 'guide-card'
              }
              key={guide._id}
              id={guide.id}
            >
              {guide.image ? (
                <img
                  className="guide-image"
                  src={guide.image.asset.url}
                  width={guide.image.asset.width}
                  height={guide.image.asset.height}
                  alt={guide.image.alt}
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
                      {journal.sourceLabel}{' '}
                      <a href={guide.source.url}>{guide.source.title}</a>
                      <span>
                        {journal.sourceDateLabel} {guide.source.accessed}.
                      </span>
                    </p>
                  </div>
                </details>
              </div>
            </Card>
          ))}
        </section>
        <Card
          variant="panel"
          padding="lg"
          className="blog-contact"
          aria-labelledby="blog-contact-title"
        >
          <div>
            <p className="eyebrow">{journal.contact.eyebrow}</p>
            <h2 id="blog-contact-title">{journal.contact.title}</h2>
            <p>{journal.contact.description}</p>
          </div>
          <a className="button" href="/#contact">
            {journal.contact.action} <ArrowRight size={16} aria-hidden="true" />
          </a>
        </Card>
      </main>
      <footer className="site-footer">
        <span>{settings.footer}</span>
        <a href="/">{journal.homeLabel}</a>
      </footer>
    </div>
  );
}
