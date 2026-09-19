import { Search, X } from 'lucide-react';
import { useMemo } from 'react';

import { CmsUnavailable } from '../../components/CmsUnavailable';
import { EmptyState } from '../../components/EmptyState';
import { PageIntro } from '../../components/PageIntro';
import { Route } from '../../routes/local-info/index';
import { formatLabel } from '../content/contentFormatting';
import { LocalHighlights } from './LocalHighlights';
import { LocalServiceCard } from './LocalServiceCard';
import {
  parseLocalInfoSearch,
  serializeLocalInfoSearch,
  type LocalInfoFilters,
} from './localInfoSearch';
import {
  filterResources,
  getAvailableResourceCategories,
} from './resourceDirectory';

export function LocalInfoPage() {
  const { content, today } = Route.useLoaderData();
  const rawSearch = Route.useSearch();
  const { query, category, outOfHoursOnly } = parseLocalInfoSearch(rawSearch);
  const navigate = Route.useNavigate();

  function updateFilters(next: Partial<LocalInfoFilters>) {
    navigate({
      search: serializeLocalInfoSearch({
        query,
        category,
        outOfHoursOnly,
        ...next,
      }),
      replace: true,
      resetScroll: false,
    });
  }

  function setQuery(value: string) {
    updateFilters({ query: value.slice(0, 120) });
  }

  function setCategory(nextCategory: typeof category) {
    updateFilters({ category: nextCategory });
  }

  function setOutOfHoursOnly(value: boolean) {
    updateFilters({ outOfHoursOnly: value });
  }

  function clearFilters() {
    navigate({ search: {}, replace: true, resetScroll: false });
  }
  const categories = useMemo(
    () => getAvailableResourceCategories(content.items),
    [content.items],
  );
  const visibleResources = useMemo(
    () => filterResources(content.items, query, category, outOfHoursOnly),
    [category, content.items, outOfHoursOnly, query],
  );
  const hasFilters = Boolean(query) || category !== 'all' || outOfHoursOnly;

  return (
    <main id="main-content">
      <PageIntro eyebrow="Useful nearby" title="Local information">
        <p>
          Find a curated starting set of nearby public services, community
          contacts, and businesses—then check the source and contact the
          provider directly.
        </p>
      </PageIntro>
      <section className="section shell directory-section">
        {content.availability === 'unavailable' ? <CmsUnavailable /> : null}
        {content.availability === 'ready' && content.items.length === 0 ? (
          <EmptyState
            title="No resources published"
            message="The local directory is currently empty."
          />
        ) : null}
        {content.availability === 'ready' && content.items.length > 0 ? (
          <>
            <LocalHighlights resources={content.items} today={today} />

            <div className="directory-tools">
              <label className="directory-search">
                <span>What do you need?</span>
                <span className="directory-search-field">
                  <Search size={19} aria-hidden="true" />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Try plumber, GP, pharmacy…"
                  />
                </span>
              </label>

              <div className="directory-filters" aria-label="Service category">
                <button
                  type="button"
                  aria-pressed={category === 'all'}
                  onClick={() => setCategory('all')}
                >
                  All
                </button>
                {categories.map((availableCategory) => (
                  <button
                    key={availableCategory}
                    type="button"
                    aria-pressed={category === availableCategory}
                    onClick={() => setCategory(availableCategory)}
                  >
                    {formatLabel(availableCategory)}
                  </button>
                ))}
              </div>

              <label className="out-of-hours-filter">
                <input
                  type="checkbox"
                  checked={outOfHoursOnly}
                  onChange={(event) => setOutOfHoursOnly(event.target.checked)}
                />
                Has an out-of-hours contact
              </label>
            </div>

            <div className="directory-results-heading" aria-live="polite">
              <p>
                {visibleResources.length}{' '}
                {visibleResources.length === 1 ? 'contact' : 'contacts'}
              </p>
              {hasFilters ? (
                <button type="button" onClick={clearFilters}>
                  <X size={15} aria-hidden="true" /> Clear filters
                </button>
              ) : null}
            </div>

            {visibleResources.length > 0 ? (
              <div className="resource-grid">
                {visibleResources.map((resource) => (
                  <LocalServiceCard
                    key={resource.documentId}
                    resource={resource}
                  />
                ))}
              </div>
            ) : (
              <div className="directory-no-results">
                <h2>No matching contacts</h2>
                <p>
                  Nothing matches
                  {query ? ` “${query}”` : ''}
                  {category !== 'all' ? ` in ${formatLabel(category)}` : ''}
                  {outOfHoursOnly ? ' with an out-of-hours contact' : ''}. Try a
                  broader search or clear the filters to browse every contact.
                </p>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={clearFilters}
                >
                  <X size={15} aria-hidden="true" /> Clear filters
                </button>
              </div>
            )}

            <p className="directory-disclaimer">
              This is a curated starting set, not a complete directory or a
              recommendation. Listings are unpaid. Check availability,
              qualifications, and costs with the provider.{' '}
              <a href="/get-involved#corrections">
                See how to suggest a correction.
              </a>
            </p>
          </>
        ) : null}
      </section>
    </main>
  );
}
