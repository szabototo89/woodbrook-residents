import { Link } from '@tanstack/react-router';
import {
  CalendarDays,
  ChevronRight,
  Clock,
  FileText,
  MapPin,
  TrainFront,
} from 'lucide-react';

import { formatDate } from '../content/contentFormatting';
import type { SearchResult } from './searchModel';

const eventTime = (date: string) =>
  new Intl.DateTimeFormat('en-IE', {
    timeStyle: 'short',
    timeZone: 'Europe/Dublin',
  }).format(new Date(date));

export function SearchResultCard(props: { result: SearchResult }) {
  const Icon =
    props.result.category === 'services'
      ? props.result.typeLabel === 'Transport'
        ? TrainFront
        : MapPin
      : props.result.category === 'events'
        ? CalendarDays
        : FileText;
  return (
    <article className="search-result">
      <div
        className={`search-result-image search-result-image-${props.result.category}`}
        aria-hidden="true"
      >
        {props.result.imagePath ? (
          <img src={props.result.imagePath} alt="" loading="lazy" />
        ) : (
          <Icon strokeWidth={1.5} />
        )}
      </div>
      <div className="search-result-copy">
        <span className={`search-badge search-badge-${props.result.tone}`}>
          {props.result.badge}
        </span>
        <p className="search-result-type">{props.result.typeLabel}</p>
        <h2>
          <Link className="search-result-link" to={props.result.href}>
            {props.result.title}
          </Link>
        </h2>
        <p className="search-result-summary">{props.result.summary}</p>
        {props.result.event ? (
          <div className="search-event-meta">
            <span>
              <CalendarDays size={17} aria-hidden="true" />
              <time dateTime={props.result.event.startsAt}>
                {formatDate(props.result.event.startsAt)}
              </time>
            </span>
            <span>
              <Clock size={17} aria-hidden="true" />
              {eventTime(props.result.event.startsAt)}
              {props.result.event.endsAt
                ? ` – ${eventTime(props.result.event.endsAt)}`
                : ''}
            </span>
            <span className="search-event-location">
              <MapPin size={17} aria-hidden="true" />
              {props.result.event.location}
            </span>
          </div>
        ) : (
          <div className="search-source-meta">
            {props.result.sourceName ? (
              <span>{props.result.sourceName}</span>
            ) : null}
            {props.result.date ? (
              <span>
                {props.result.category === 'services'
                  ? 'Source checked'
                  : 'Updated'}{' '}
                <time dateTime={props.result.date}>
                  {formatDate(props.result.date)}
                </time>
              </span>
            ) : null}
          </div>
        )}
      </div>
      <ChevronRight
        className="search-result-arrow"
        size={25}
        aria-hidden="true"
      />
    </article>
  );
}
