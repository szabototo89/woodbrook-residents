import { Link, useHydrated } from '@tanstack/react-router';
import { ChevronLeft, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { CmsUnavailable } from '../../components/CmsUnavailable';
import { Route } from '../../routes/search';
import {
  parseSearchParams,
  searchCategories,
  searchContent,
  type SearchParams,
} from './searchModel';
import { SearchResultCard } from './SearchResultCard';
import './search.css';

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
    <>
      <main id="main-content" className="search-page">
        <div className="search-shell">
          <Link className="search-back" to="/">
            <ChevronLeft size={20} aria-hidden="true" />
            Back
          </Link>
          <h1>Search results</h1>
          <p className="search-count" role="status" aria-live="polite">
            {content.availability === 'unavailable' ? (
              'Search is temporarily unavailable'
            ) : params.q ? (
              <>
                {results.length} {results.length === 1 ? 'result' : 'results'}{' '}
                for <strong>“{params.q}”</strong>
              </>
            ) : (
              'Find what matters in your neighbourhood'
            )}
          </p>
          <form
            role="search"
            className="community-search"
            onSubmit={(event) => {
              event.preventDefault();
              updateSearch(parseSearchParams({ q: draft, category: 'all' }));
            }}
          >
            <button
              className="search-submit"
              type="submit"
              aria-label="Submit search"
            >
              <Search size={25} aria-hidden="true" />
            </button>
            <input
              ref={inputRef}
              type="search"
              aria-label="Search community information"
              placeholder="Search updates, projects, events…"
              maxLength={120}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            {draft ? (
              <button
                className="search-clear"
                type="button"
                aria-label="Clear search"
                onClick={clearSearch}
              >
                <X size={18} aria-hidden="true" />
              </button>
            ) : null}
          </form>
          <div
            className="search-filters"
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
          {content.availability === 'unavailable' ? (
            <>
              <CmsUnavailable />
              <a className="text-link search-retry" href="">
                Try again
              </a>
            </>
          ) : results.length ? (
            <section className="search-results" aria-label="Search results">
              {results.map((result) => (
                <SearchResultCard key={result.id} result={result} />
              ))}
            </section>
          ) : (
            <section className="search-empty">
              <Search size={34} aria-hidden="true" />
              <h2>
                {!params.q
                  ? 'What are you looking for?'
                  : emptyCategory
                    ? `No ${params.category} found`
                    : 'No results found'}
              </h2>
              <p>
                {!params.q
                  ? 'Search community updates, projects, events and local services.'
                  : emptyCategory
                    ? 'Try another category or view all results for this search.'
                    : 'Try a different word, check your spelling, or use a broader search.'}
              </p>
              {emptyCategory ? (
                <button
                  className="button"
                  onClick={() => updateSearch({ q: params.q, category: 'all' })}
                >
                  View all results
                </button>
              ) : null}
            </section>
          )}
        </div>
      </main>
    </>
  );
}
