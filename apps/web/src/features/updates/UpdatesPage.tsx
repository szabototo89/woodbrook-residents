import { CmsUnavailable } from '../../components/CmsUnavailable';
import { EmptyState } from '../../components/EmptyState';
import { PageIntro } from '../../components/PageIntro';
import { UpdateCard } from '../../components/UpdateCard';
import { Route } from '../../routes/updates/index';
import { FeaturedNewsCard } from './FeaturedNewsCard';
import './updates.css';

export function UpdatesPage() {
  const content = Route.useLoaderData();

  return (
    <main id="main-content">
      <PageIntro eyebrow="Stay informed" title="News">
        <p>
          Clear, source-linked notes on transport, planning, public spaces, and
          the practical changes residents need to know about.
        </p>
      </PageIntro>
      <section
        className="section shell updates-content"
        aria-label="Local news"
      >
        {content.availability === 'unavailable' ? <CmsUnavailable /> : null}
        {content.featuredUpdate ? (
          <FeaturedNewsCard update={content.featuredUpdate} headingLevel={2} />
        ) : null}
        {content.featuredUpdate && content.items.length > 0 ? (
          <h2 className="updates-latest-title">Latest news</h2>
        ) : null}
        {content.availability === 'ready' &&
        content.items.length === 0 &&
        !content.featuredUpdate ? (
          <EmptyState
            title="No news published"
            message="There are no published community news yet."
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
