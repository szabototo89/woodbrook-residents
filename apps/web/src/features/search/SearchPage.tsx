import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CmsUnavailable } from '../../components/CmsUnavailable';
import { PageIntro } from '../../components/PageIntro';
import { SiteSearch } from '../../components/SiteSearch';
import { Route } from '../../routes/search';
import { searchPublicContent } from './siteSearch';

export function SearchPage() {
  const content = Route.useLoaderData();
  const { q } = Route.useSearch();
  const [query, setQuery] = useState('');
  // Prerendered search HTML has no query. Apply the browser URL after hydration.
  useEffect(() => setQuery(q), [q]);
  const results = searchPublicContent(content.items, query);
  return (
    <main id="main-content">
      <PageIntro eyebrow="Find it locally" title="Search Woodbrook">
        <p>
          Updates, events, projects, consultations and practical information, in
          one place.
        </p>
      </PageIntro>
      <section className="section shell search-page-results">
        <SiteSearch key={query} query={query} />
        {content.availability === 'unavailable' ? (
          <CmsUnavailable />
        ) : (
          <>
            <p role="status">
              {query
                ? `${results.length} ${results.length === 1 ? 'result' : 'results'} for “${query}”`
                : 'Enter a search to find published local information.'}
            </p>
            {query && results.length === 0 ? (
              <p>
                Try a broader search, such as transport, health or Woodbrook.
              </p>
            ) : null}
            <div className="search-results">
              {results.map((result) => (
                <a
                  className="search-result"
                  key={result.href}
                  href={result.href}
                >
                  <div>
                    <span className="tag">{result.type}</span>
                    <h2>{result.title}</h2>
                    <p>{result.summary}</p>
                  </div>
                  <ArrowRight size={20} aria-hidden="true" />
                </a>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
