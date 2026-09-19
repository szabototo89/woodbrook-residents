import { Link } from '@tanstack/react-router';
import { ArrowRight, CalendarDays } from 'lucide-react';

import { formatDate, formatLabel } from '../features/content/contentFormatting';
import type { Update } from '../features/content/contentTypes';

export function UpdateCard(props: { update: Update }) {
  return (
    <article className="content-card update-card">
      {props.update.imagePath ? (
        <img
          src={props.update.imagePath}
          alt={props.update.imageAlt ?? ''}
          loading="lazy"
        />
      ) : null}
      <div className="card-body">
        <div className="card-meta">
          <span className="tag">{formatLabel(props.update.kind)}</span>
          <span>
            <CalendarDays size={14} aria-hidden="true" />
            {formatDate(props.update.publishedOn)}
          </span>
        </div>
        <h3>
          <Link
            className="card-stretched-link"
            to="/updates/$slug"
            params={{ slug: props.update.slug }}
          >
            {props.update.title}
          </Link>
        </h3>
        <p>{props.update.summary}</p>
        <Link
          className="text-link card-secondary-link"
          to="/updates/$slug"
          params={{ slug: props.update.slug }}
          aria-label={`Read ${props.update.title}`}
        >
          Read update <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
