import { PageIntro } from '../../components/PageIntro';

export function SearchPending() {
  return (
    <main id="main-content">
      <PageIntro eyebrow="Find what you need" title="Search results">
        <p>
          Find local services, community news, projects and events in one place.
        </p>
      </PageIntro>
      <section className="section shell" role="status">
        Searching community information…
      </section>
    </main>
  );
}
