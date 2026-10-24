import { Link } from '@tanstack/react-router';
import { ArrowRight, CalendarDays, Clock3, MapPin } from 'lucide-react';
import type { CommunityEvent } from '../content/contentTypes';
import { formatDate } from '../content/contentFormatting';

type HomeEventCardProps = { event: CommunityEvent };

export function HomeEventCard(props: HomeEventCardProps) {
  const timeFormat = new Intl.DateTimeFormat('en-IE', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Europe/Dublin',
  });
  const isHalloween = /halloween/i.test(props.event.title);
  return (
    <article className="home-featured-event" aria-labelledby="home-event-title">
      <div
        className={
          isHalloween
            ? 'home-event-art home-event-illustration'
            : 'home-event-art'
        }
        aria-hidden="true"
      >
        {isHalloween ? (
          <img
            src="/images/halloween-event-768.webp"
            alt=""
            width="1536"
            height="1024"
            loading="lazy"
          />
        ) : (
          <>
            <span />
            <span />
            <span />
          </>
        )}
      </div>
      <div className="home-event-copy">
        <p className="event-pill">Upcoming event</p>
        <h2 id="home-event-title">{props.event.title}</h2>
        <div className="home-event-meta">
          <span>
            <CalendarDays size={19} aria-hidden="true" />
            <time dateTime={props.event.startsAt}>
              {formatDate(props.event.startsAt)}
            </time>
          </span>
          {!props.event.allDay ? (
            <span>
              <Clock3 size={19} aria-hidden="true" />
              {timeFormat.format(new Date(props.event.startsAt))}
              {props.event.endsAt
                ? ` – ${timeFormat.format(new Date(props.event.endsAt))}`
                : ''}
            </span>
          ) : null}
          <span>
            <MapPin size={19} aria-hidden="true" />
            {props.event.location}
          </span>
        </div>
        <p className="home-event-summary">{props.event.summary}</p>
      </div>
      <Link
        className="button"
        to="/events/$slug"
        params={{ slug: props.event.slug }}
      >
        View event details <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </article>
  );
}
