import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';

import { formatDateTime } from '../features/content/contentFormatting';
import type { CommunityEvent } from '../features/content/contentTypes';

export function EventCard({ event }: { event: CommunityEvent }) {
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
        <h2>{event.title}</h2>
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
        <a
          className="text-link"
          href={event.bookingUrl ?? event.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          Check organiser details <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
