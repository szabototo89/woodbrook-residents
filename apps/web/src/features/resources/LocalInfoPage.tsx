import { CmsUnavailable } from '../../components/CmsUnavailable';
import { EmptyState } from '../../components/EmptyState';
import { PageIntro } from '../../components/PageIntro';
import { ResourceCard } from '../../components/ResourceCard';
import { Route } from '../../routes/local-info';

export function LocalInfoPage() {
  const content = Route.useLoaderData();

  return (
    <main id="main-content">
      <PageIntro eyebrow="Useful nearby" title="Local information">
        <p>
          A concise directory of official transport, council, community, safety,
          and waste services residents commonly need.
        </p>
      </PageIntro>
      <section className="section shell">
        <aside className="emergency-note">
          <strong>Is somebody in immediate danger?</strong>
          <span>
            Call 112 or 999. This website is not an emergency service.
          </span>
        </aside>
        {content.availability === 'unavailable' ? <CmsUnavailable /> : null}
        {content.availability === 'ready' && content.items.length === 0 ? (
          <EmptyState
            title="No resources published"
            message="The local directory is currently empty."
          />
        ) : null}
        <div className="resource-grid">
          {content.items.map((resource) => (
            <ResourceCard key={resource.documentId} resource={resource} />
          ))}
        </div>
      </section>
    </main>
  );
}
