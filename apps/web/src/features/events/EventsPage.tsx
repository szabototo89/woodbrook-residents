import { CmsUnavailable } from '../../components/CmsUnavailable';
import { EmptyState } from '../../components/EmptyState';
import { EventCard } from '../../components/EventCard';
import { PageIntro } from '../../components/PageIntro';
import { Route } from '../../routes/events/index';

export function EventsPage() {
  const content = Route.useLoaderData();

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
        <div className="stack-list">
          {content.items.map((event) => (
            <EventCard key={event.documentId} event={event} />
          ))}
        </div>
      </section>
    </main>
  );
}
