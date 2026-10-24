import { Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { formatDate, formatLabel } from '../content/contentFormatting';
import type { Update } from '../content/contentTypes';
import './featured-news.css';

export function HomeFeaturedNews(props: { update: Update }) {
  return (
    <article
      className="home-featured-news"
      aria-labelledby="home-featured-news-title"
    >
      <div className="home-featured-news-copy">
        <p className="home-featured-news-label">Featured news</p>
        <div className="home-row-meta">
          <span>{formatLabel(props.update.kind)}</span>
          <time dateTime={props.update.publishedOn}>
            {formatDate(props.update.publishedOn)}
          </time>
        </div>
        <h3 id="home-featured-news-title">
          <Link to="/updates/$slug" params={{ slug: props.update.slug }}>
            {props.update.title}
          </Link>
        </h3>
        <p className="home-featured-news-summary">{props.update.summary}</p>
        <p className="home-featured-news-source">{props.update.sourceName}</p>
        <span className="home-featured-news-action" aria-hidden="true">
          Read the story <ArrowUpRight size={19} />
        </span>
      </div>
      {props.update.imagePath ? (
        <img
          src={props.update.imagePath}
          alt={props.update.imageAlt ?? ''}
          width="360"
          height="400"
          loading="lazy"
        />
      ) : null}
    </article>
  );
}
