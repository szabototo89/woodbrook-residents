import { Link } from '@tanstack/react-router';
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';

import { formatDateTime } from '../features/content/contentFormatting';
import type { CommunityEvent } from '../features/content/contentTypes';

export function EventCard({
  event,
  headingLevel = 2,
}: {
  event: CommunityEvent;
  headingLevel?: 2 | 3;
}) {
  const Heading = `h${headingLevel}` as const;

  return (
    <article className="event-card">
      <div className="event-date" aria-hidden="true">
        <strong>
          {new Intl.DateTimeFormat('en-IE', {
            day: '2-digit',
            timeZone: 'Europe/Dublin',
          }).format(new Date(event.startsAt))}
        </strong>
        <span>
          {new Intl.DateTimeFormat('en-IE', {
            month: 'short',
            timeZone: 'Europe/Dublin',
          }).format(new Date(event.startsAt))}
        </span>
      </div>
      <div>
        <Heading>
          <Link to="/events/$slug" params={{ slug: event.slug }}>
            {event.title}
          </Link>
        </Heading>
        <p>{event.summary}</p>
        <div className="event-meta">
          <span>
            <CalendarDays size={16} aria-hidden="true" />
            {formatDateTime(event.startsAt)}
          </span>
          <span>
            <MapPin size={16} aria-hidden="true" />
            {event.location}
          </span>
        </div>
        <Link
          className="text-link"
          to="/events/$slug"
          params={{ slug: event.slug }}
          aria-label={`View event: ${event.title}`}
        >
          View event <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
