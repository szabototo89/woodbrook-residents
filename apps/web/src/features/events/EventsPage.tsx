import { useSyncExternalStore } from 'react';

import { CmsUnavailable } from '../../components/CmsUnavailable';
import { EmptyState } from '../../components/EmptyState';
import { EventCard } from '../../components/EventCard';
import { PageIntro } from '../../components/PageIntro';
import { Route } from '../../routes/events/index';
import { groupEventsByTimeline } from './eventTimeline';

const subscribeToHydration = () => () => {};

function useHasHydrated() {
  return useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
}

export function EventsPage() {
  const content = Route.useLoaderData();
  const hasHydrated = useHasHydrated();
  const timeline = hasHydrated ? groupEventsByTimeline(content.items) : [];

  return (
    <main id="main-content">
      <PageIntro eyebrow="Meet and take part" title="Events">
        <p>
          Confirmed local dates from organisers and public bodies. Always check
          the linked organiser page before travelling.
        </p>
      </PageIntro>
      <section className="section shell narrow">
        {content.availability === 'unavailable' ? <CmsUnavailable /> : null}
        {content.availability === 'ready' && content.items.length === 0 ? (
          <EmptyState
            title="No upcoming events published"
            message="The calendar is ready for verified community meetings, clean-ups, and local events."
          />
        ) : null}
        {!hasHydrated && content.items.length > 0 ? (
          <div className="stack-list">
            {content.items.map((event) => (
              <EventCard key={event.documentId} event={event} />
            ))}
          </div>
        ) : null}
        {hasHydrated && timeline.length > 0 ? (
          <div className="event-timeline" aria-label="Events by date">
            {timeline.map((period) => (
              <section
                className={`event-period event-period-${period.id}`}
                aria-labelledby={`event-period-${period.id}`}
                key={period.id}
              >
                <header className="event-period-header">
                  <div>
                    <span className="event-period-marker" aria-hidden="true" />
                    <h2 id={`event-period-${period.id}`}>{period.title}</h2>
                  </div>
                  <p>{period.dateRange}</p>
                </header>
                <div className="stack-list">
                  {period.events.map((event) => (
                    <EventCard
                      key={event.documentId}
                      event={event}
                      headingLevel={3}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
