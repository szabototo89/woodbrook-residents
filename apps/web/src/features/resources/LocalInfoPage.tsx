import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { CmsUnavailable } from '../../components/CmsUnavailable';
import { EmptyState } from '../../components/EmptyState';
import { PageIntro } from '../../components/PageIntro';
import { Route } from '../../routes/local-info/index';
import { formatLabel } from '../content/contentFormatting';
import { LocalServiceCard } from './LocalServiceCard';
import {
  filterResources,
  getAvailableResourceCategories,
  type ResourceCategoryFilter,
} from './resourceDirectory';

export function LocalInfoPage() {
  const content = Route.useLoaderData();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ResourceCategoryFilter>('all');
  const [outOfHoursOnly, setOutOfHoursOnly] = useState(false);
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
          Find useful nearby health services, trades, professional help, and
          public services—then call or visit their website directly.
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
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setCategory('all');
                    setOutOfHoursOnly(false);
                  }}
                >
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
                <p>Try a broader search or clear one of the filters.</p>
              </div>
            )}

            <p className="directory-disclaimer">
              Listings are provided for convenience, not as endorsements. Check
              availability, qualifications, and costs directly with the
              provider.
            </p>
          </>
        ) : null}
      </section>
    </main>
  );
}
