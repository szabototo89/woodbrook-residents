import { Link } from '@tanstack/react-router';
import { ArrowRight, CalendarDays } from 'lucide-react';

import { formatDate, formatLabel } from '../features/content/contentFormatting';
import type { Update } from '../features/content/contentTypes';

export function UpdateCard({ update }: { update: Update }) {
  return (
    <article className="content-card update-card">
      {update.imagePath ? (
        <img
          src={update.imagePath}
          alt={update.imageAlt ?? ''}
          loading="lazy"
        />
      ) : null}
      <div className="card-body">
        <div className="card-meta">
          <span className="tag">{formatLabel(update.kind)}</span>
          <span>
            <CalendarDays size={14} aria-hidden="true" />
            {formatDate(update.publishedOn)}
          </span>
        </div>
        <h3>
          <Link
            className="card-stretched-link"
            to="/updates/$slug"
            params={{ slug: update.slug }}
          >
            {update.title}
          </Link>
        </h3>
        <p>{update.summary}</p>
        <Link
          className="text-link card-secondary-link"
          to="/updates/$slug"
          params={{ slug: update.slug }}
          aria-label={`Read ${update.title}`}
        >
          Read update <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
