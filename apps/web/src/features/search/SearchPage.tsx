import { ArrowRight } from 'lucide-react';
import { CmsUnavailable } from '../../components/CmsUnavailable';
import { PageIntro } from '../../components/PageIntro';
import { SiteSearch } from '../../components/SiteSearch';
import { Route } from '../../routes/search';
import { searchPublicContent } from './siteSearch';

export function SearchPage() {
  const content = Route.useLoaderData();
  const { q } = Route.useSearch();
  const results = searchPublicContent(content.items, q);
  return (
    <main id="main-content">
      <PageIntro eyebrow="Find it locally" title="Search Woodbrook">
        <p>
          Updates, events, projects, consultations and practical information, in
          one place.
        </p>
      </PageIntro>
      <section className="section shell search-page-results">
        <SiteSearch key={q} query={q} />
        {content.availability === 'unavailable' ? (
          <CmsUnavailable />
        ) : (
          <>
            <p role="status">
              {q
                ? `${results.length} ${results.length === 1 ? 'result' : 'results'} for “${q}”`
                : 'Enter a search to find published local information.'}
            </p>
            {q && results.length === 0 ? (
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
