import { Link } from '@tanstack/react-router';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { formatDate, formatLabel } from '../content/contentFormatting';
import type { Update } from '../content/contentTypes';
import { FeaturedNewsCard } from '../updates/FeaturedNewsCard';

type HomeUpdatesProps = {
  updates: Update[];
  featuredUpdate?: Update;
};

export function HomeUpdates(props: HomeUpdatesProps) {
  return (
    <section
      className="home-updates home-panel"
      aria-labelledby="home-updates-title"
    >
      <div className="home-section-heading">
        <h2 id="home-updates-title">What’s new in Woodbrook</h2>
        <Link to="/updates">
          View all news <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
      {props.featuredUpdate ? (
        <FeaturedNewsCard update={props.featuredUpdate} />
      ) : null}
      {props.featuredUpdate && props.updates.length > 0 ? (
        <p className="home-more-news">More local news</p>
      ) : null}
      {props.updates.length === 0 && !props.featuredUpdate ? (
        <p className="home-empty">
          No news published yet. Check back for source-linked local news.
        </p>
      ) : (
        <div className="home-update-list">
          {props.updates.slice(0, 3).map((update) => (
            <article key={update.documentId} className="home-update">
              {update.imagePath ? (
                <img
                  src={update.imagePath}
                  alt={update.imageAlt ?? ''}
                  width="150"
                  height="110"
                  loading="lazy"
                />
              ) : null}
              <div>
                <div className="home-row-meta">
                  <span className={`tag update-kind-${update.kind}`}>
                    {formatLabel(update.kind)}
                  </span>
                  <time dateTime={update.publishedOn}>
                    {formatDate(update.publishedOn)}
                  </time>
                </div>
                <h3>
                  <Link to="/updates/$slug" params={{ slug: update.slug }}>
                    {update.title}
                  </Link>
                </h3>
                <p>{update.summary}</p>
                <div className="home-update-source">
                  <span>{update.sourceName}</span>
                </div>
              </div>
              <ChevronRight size={21} aria-hidden="true" />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
