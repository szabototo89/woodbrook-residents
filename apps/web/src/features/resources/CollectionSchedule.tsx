import { Download, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

import { formatDate } from '../content/contentFormatting';
import type { Resource } from '../content/contentTypes';
import {
  collectionStreamLabels,
  getDublinCalendarDate,
  getNextCollectionDates,
} from './collectionScheduleUtils';

type CollectionScheduleProps = Pick<
  Resource,
  'collectionDates' | 'documentLabel' | 'documentUrl'
> & {
  today?: string;
};

export function CollectionSchedule(props: CollectionScheduleProps) {
  const [today, setToday] = useState(props.today);

  useEffect(() => {
    if (!props.today) {
      setToday(getDublinCalendarDate());
    }
  }, [props.today]);

  const upcomingCollections = today
    ? getNextCollectionDates(props.collectionDates, today)
    : [];
  const hasUpcomingCollection = upcomingCollections.some(
    (collection) => collection.date,
  );
  const downloadName = props.documentUrl?.split('/').at(-1);

  return (
    <section
      className="service-detail-section collection-schedule"
      aria-labelledby="collection-schedule-heading"
    >
      <p className="eyebrow">Collection calendar</p>
      <h2 id="collection-schedule-heading">Next collection dates</h2>

      {!today ? (
        <p aria-live="polite">Checking the next collection dates…</p>
      ) : hasUpcomingCollection ? (
        <dl className="collection-date-grid" aria-live="polite">
          {upcomingCollections.map((collection) => (
            <div key={collection.stream}>
              <dt>{collectionStreamLabels[collection.stream]}</dt>
              <dd>
                {collection.date ? (
                  <time dateTime={collection.date}>
                    {formatDate(collection.date)}
                  </time>
                ) : (
                  'No later date listed for 2026'
                )}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p aria-live="polite">
          No remaining 2026 dates are listed. Check with Thorntons for the
          current schedule.
        </p>
      )}

      {props.documentUrl ? (
        <div className="button-row collection-schedule-actions">
          <a
            className="button"
            href={props.documentUrl}
            target="_blank"
            rel="noreferrer"
          >
            View {props.documentLabel ?? 'collection schedule'}{' '}
            <ExternalLink size={16} aria-hidden="true" />
          </a>
          <a
            className="button button-secondary"
            href={props.documentUrl}
            download={downloadName}
          >
            Download PDF <Download size={16} aria-hidden="true" />
          </a>
        </div>
      ) : null}

      <p className="collection-schedule-note">
        This calendar is for Thorntons customers who received this schedule.
        Collection arrangements can vary by route; confirm it matches your
        address before relying on it.
      </p>
    </section>
  );
}
