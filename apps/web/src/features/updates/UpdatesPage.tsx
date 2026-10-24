import { useHydrated } from '@tanstack/react-router';
import { CmsUnavailable } from '../../components/CmsUnavailable';
import { EmptyState } from '../../components/EmptyState';
import { PageIntro } from '../../components/PageIntro';
import { UpdateCard } from '../../components/UpdateCard';
import { Route } from '../../routes/updates/index';
import { formatLabel } from '../content/contentFormatting';
import { updateKinds } from '../content/contentTaxonomy';
import { parseNewsParams, selectNews, type NewsParams } from './newsFilters';
import { FeaturedNewsCard } from './FeaturedNewsCard';
import './updates.css';

export function UpdatesPage() {
  const content = Route.useLoaderData();
  const urlParams = Route.useSearch();
  const hydrated = useHydrated();
  // Prerendered pages have default controls; apply saved URL filters after hydration.
  const params =
    __STATIC_SITE_BUILD__ && !hydrated ? parseNewsParams({}) : urlParams;
  const navigate = Route.useNavigate();
  const { featuredUpdate, items } = selectNews(content, params);
  const resultCount = items.length + (featuredUpdate ? 1 : 0);
  const filtersActive = params.category !== 'all' || params.sort !== 'newest';

  function changeFilters(search: NewsParams) {
    void navigate({ search, resetScroll: false });
  }

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
        {content.availability === 'ready' ? (
          <div className="news-tools">
            <div
              className="news-filters"
              role="group"
              aria-label="Filter and sort news"
            >
              <div className="news-filter-field">
                <label htmlFor="news-category">Category</label>
                <select
                  id="news-category"
                  value={params.category}
                  onChange={(event) =>
                    changeFilters(
                      parseNewsParams({
                        ...params,
                        category: event.target.value,
                      }),
                    )
                  }
                >
                  <option value="all">All categories</option>
                  {updateKinds.map((kind) => (
                    <option key={kind} value={kind}>
                      {formatLabel(kind)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="news-filter-field">
                <label htmlFor="news-sort">Sort by</label>
                <select
                  id="news-sort"
                  value={params.sort}
                  onChange={(event) =>
                    changeFilters(
                      parseNewsParams({ ...params, sort: event.target.value }),
                    )
                  }
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>
            </div>
            <div className="news-results-heading">
              <p role="status" aria-live="polite">
                {resultCount} {resultCount === 1 ? 'article' : 'articles'}
              </p>
              {filtersActive ? (
                <button
                  type="button"
                  className="text-link"
                  onClick={() => changeFilters(parseNewsParams({}))}
                >
                  Reset filters
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <CmsUnavailable />
        )}
        {featuredUpdate ? (
          <FeaturedNewsCard update={featuredUpdate} headingLevel={2} />
        ) : null}
        {featuredUpdate && items.length > 0 ? (
          <h2 className="updates-latest-title">Latest news</h2>
        ) : null}
        {content.availability === 'ready' &&
        items.length === 0 &&
        !featuredUpdate ? (
          <EmptyState
            title={filtersActive ? 'No matching news' : 'No news published'}
            message={
              filtersActive
                ? 'Try another category or reset the filters to see all news.'
                : 'There is no published community news yet.'
            }
          />
        ) : null}
        <div className="card-grid">
          {items.map((update) => (
            <UpdateCard key={update.documentId} update={update} />
          ))}
        </div>
      </section>
    </main>
  );
}
