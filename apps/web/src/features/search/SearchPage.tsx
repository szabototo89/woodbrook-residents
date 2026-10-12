import { Link, useHydrated } from '@tanstack/react-router';
import { ArrowLeft, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { CmsUnavailable } from '../../components/CmsUnavailable';
import { EmptyState } from '../../components/EmptyState';
import { PageIntro } from '../../components/PageIntro';
import { SearchField } from '../../components/SearchField';
import { Route } from '../../routes/search';
import {
  parseSearchParams,
  searchCategories,
  searchContent,
  type SearchParams,
} from './searchModel';
import { SearchResultCard } from './SearchResultCard';

export function SearchPage() {
  const content = Route.useLoaderData();
  const urlParams = Route.useSearch();
  const hydrated = useHydrated();
  // Static HTML is built without query parameters. Match that HTML during
  // hydration before displaying the query from a bookmarked search URL.
  const params =
    __STATIC_SITE_BUILD__ && !hydrated ? parseSearchParams({}) : urlParams;
  const navigate = Route.useNavigate();
  const [draft, setDraft] = useState(params.q);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setDraft(params.q);
  }, [params.q]);
  const { results, counts } = searchContent(content.items, params);

  function updateSearch(search: SearchParams) {
    void navigate({ search, resetScroll: false });
  }

  function clearSearch() {
    setDraft('');
    updateSearch({ q: '', category: 'all' });
    inputRef.current?.focus();
  }

  const emptyCategory = counts.all > 0 && params.category !== 'all';
  return (
    <main id="main-content">
      <PageIntro eyebrow="Find what you need" title="Search results">
        <p>
          Find local services, community updates, projects and events in one
          place.
        </p>
        <Link className="text-link" to="/">
          <ArrowLeft size={16} aria-hidden="true" />
          Back
        </Link>
      </PageIntro>
      <section className="section shell directory-section">
        <form
          className="directory-tools"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            updateSearch(parseSearchParams({ q: draft, category: 'all' }));
          }}
        >
          <SearchField
            label="Search community information"
            placeholder="Try a service, update, project or event…"
            value={draft}
            onChange={setDraft}
            inputRef={inputRef}
            submitButton
            onClear={clearSearch}
          />
          <div
            className="directory-filters"
            role="group"
            aria-label="Filter search results"
          >
            {searchCategories.map((category) => (
              <button
                key={category.value}
                type="button"
                aria-pressed={params.category === category.value}
                onClick={() =>
                  updateSearch({ q: params.q, category: category.value })
                }
              >
                {category.label} ({counts[category.value]})
              </button>
            ))}
          </div>
        </form>
        <div className="directory-results-heading">
          <p role="status" aria-live="polite">
            {content.availability === 'unavailable' ? (
              'Search is temporarily unavailable'
            ) : params.q ? (
              <>
                {results.length} {results.length === 1 ? 'result' : 'results'}{' '}
                for <strong>“{params.q}”</strong>
              </>
            ) : (
              'Enter a search to find community information'
            )}
          </p>
        </div>
        {content.availability === 'unavailable' ? (
          <>
            <CmsUnavailable />
            <a className="text-link" href="">
              Try again
            </a>
          </>
        ) : results.length ? (
          <section className="card-grid" aria-label="Search results">
            {results.map((result) => (
              <SearchResultCard key={result.id} result={result} />
            ))}
          </section>
        ) : (
          <EmptyState
            icon={Search}
            title={
              !params.q
                ? 'What are you looking for?'
                : emptyCategory
                  ? `No ${params.category} found`
                  : 'No results found'
            }
            message={
              !params.q
                ? 'Search local services, community updates, projects and events.'
                : emptyCategory
                  ? 'Try another category or view all results for this search.'
                  : 'Try a different word, check your spelling, or use a broader search.'
            }
          >
            {emptyCategory ? (
              <button
                type="button"
                className="button button-secondary"
                onClick={() => updateSearch({ q: params.q, category: 'all' })}
              >
                View all results
              </button>
            ) : null}
          </EmptyState>
        )}
      </section>
    </main>
  );
}
