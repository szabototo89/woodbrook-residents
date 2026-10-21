import { handoffs } from './handoffs';

export function HandoffsPage(props: { documents?: typeof handoffs }) {
  const documents = props.documents ?? handoffs;
  return (
    <main id="main-content" className="handoffs-page shell">
      <header className="handoffs-intro">
        <p className="eyebrow">Project notebook</p>
        <h1>Agent handoffs</h1>
        <p>
          Context, decisions, architecture, and evidence for the next agent.
        </p>
      </header>
      <section aria-label="Handoff documents" className="handoff-list">
        {documents.length === 0 ? (
          <p role="status">
            No handoffs yet. Add{' '}
            <code>docs/handoffs/&lt;feature-slug&gt;/index.mdx</code> to get
            started.
          </p>
        ) : null}
        {documents.map((handoff) => (
          <a
            key={handoff.slug}
            className="handoff-card"
            href={`#/${handoff.slug}`}
          >
            <div>
              <h2>{handoff.title}</h2>
              <p>{handoff.summary}</p>
              <span>
                Read handoff <span aria-hidden="true">↗</span>
              </span>
            </div>
          </a>
        ))}
      </section>
    </main>
  );
}
