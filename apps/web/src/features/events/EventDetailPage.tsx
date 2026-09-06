import { Link } from '@tanstack/react-router';
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  MapPin,
} from 'lucide-react';

import { formatDate, formatDateTime } from '../content/contentFormatting';
import { Route } from '../../routes/events/$slug';

export function EventDetailPage() {
  const event = Route.useLoaderData();

  if (!event) {
    return (
      <main id="main-content" className="section shell narrow">
        <p className="eyebrow">Event unavailable</p>
        <h1>We couldn’t find that event</h1>
        <p>
          It may have been unpublished, or the content service may be offline.
        </p>
        <Link className="text-link" to="/events">
          <ArrowLeft size={16} aria-hidden="true" /> Back to events
        </Link>
      </main>
    );
  }

  const actionUrl = event.bookingUrl ?? event.sourceUrl;

  return (
    <main id="main-content">
      <article className="article-page">
        <header className="article-header shell narrow">
          <Link className="back-link" to="/events">
            <ArrowLeft size={15} aria-hidden="true" /> All events
          </Link>
          <div className="card-meta">
            <span className="tag">Event</span>
            <span>
              <CalendarDays size={14} aria-hidden="true" />
              {formatDate(event.startsAt)}
            </span>
          </div>
          <h1>{event.title}</h1>
          <p className="article-deck">{event.summary}</p>
        </header>
        <div className="article-body shell narrow">
          <dl className="detail-facts">
            <div>
              <dt>
                <Clock3 size={17} aria-hidden="true" /> Starts
              </dt>
              <dd>{formatDateTime(event.startsAt)}</dd>
            </div>
            {event.endsAt ? (
              <div>
                <dt>
                  <Clock3 size={17} aria-hidden="true" /> Ends
                </dt>
                <dd>{formatDateTime(event.endsAt)}</dd>
              </div>
            ) : null}
            <div>
              <dt>
                <MapPin size={17} aria-hidden="true" /> Location
              </dt>
              <dd>{event.location}</dd>
            </div>
          </dl>
          <a
            className="button button-primary detail-action"
            href={actionUrl}
            target="_blank"
            rel="noreferrer"
          >
            {event.bookingUrl ? 'Check organiser details' : 'View event source'}
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <aside className="source-note">
            <p className="eyebrow">Source and freshness</p>
            <p>
              Event details were checked against the organiser’s public
              information on {formatDate(event.sourceReviewedOn)}.
            </p>
            <a
              className="text-link"
              href={event.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              Read the original source{' '}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </aside>
        </div>
      </article>
    </main>
  );
}
