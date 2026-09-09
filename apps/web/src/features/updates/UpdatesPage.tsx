import { CmsUnavailable } from '../../components/CmsUnavailable';
import { EmptyState } from '../../components/EmptyState';
import { PageIntro } from '../../components/PageIntro';
import { UpdateCard } from '../../components/UpdateCard';
import { Route } from '../../routes/updates/index';

export function UpdatesPage() {
  const content = Route.useLoaderData();

  return (
    <main id="main-content">
      <PageIntro eyebrow="Stay informed" title="Updates">
        <p>
          Clear, source-linked notes on transport, planning, public spaces, and
          the practical changes residents need to know about.
        </p>
      </PageIntro>
      <section className="section shell">
        {content.availability === 'unavailable' ? <CmsUnavailable /> : null}
        {content.availability === 'ready' && content.items.length === 0 ? (
          <EmptyState
            title="No updates published"
            message="There are no published community updates yet."
          />
        ) : null}
        <div className="card-grid">
          {content.items.map((update) => (
            <UpdateCard key={update.documentId} update={update} />
          ))}
        </div>
      </section>
    </main>
  );
}
