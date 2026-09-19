import { Link } from '@tanstack/react-router';
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';

import { formatDateTime } from '../features/content/contentFormatting';
import type { CommunityEvent } from '../features/content/contentTypes';

export function EventCard(props: {
  event: CommunityEvent;
  headingLevel?: 2 | 3;
}) {
  const headingLevel = props.headingLevel ?? 2;
  const Heading = `h${headingLevel}` as const;

  return (
    <article className="event-card">
      <div className="event-date" aria-hidden="true">
        <strong>
          {new Intl.DateTimeFormat('en-IE', {
            day: '2-digit',
            timeZone: 'Europe/Dublin',
          }).format(new Date(props.event.startsAt))}
        </strong>
        <span>
          {new Intl.DateTimeFormat('en-IE', {
            month: 'short',
            timeZone: 'Europe/Dublin',
          }).format(new Date(props.event.startsAt))}
        </span>
      </div>
      <div>
        <Heading>
          <Link
            className="card-stretched-link"
            to="/events/$slug"
            params={{ slug: props.event.slug }}
          >
            {props.event.title}
          </Link>
        </Heading>
        <p>{props.event.summary}</p>
        <div className="event-meta">
          <span>
            <CalendarDays size={16} aria-hidden="true" />
            {formatDateTime(props.event.startsAt)}
          </span>
          <span>
            <MapPin size={16} aria-hidden="true" />
            {props.event.location}
          </span>
        </div>
        <Link
          className="text-link card-secondary-link"
          to="/events/$slug"
          params={{ slug: props.event.slug }}
          aria-label={`View event: ${props.event.title}`}
        >
          View event <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
