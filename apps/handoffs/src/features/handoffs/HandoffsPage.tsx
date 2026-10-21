import { handoffs } from './handoffs';

export function HandoffsPage() {
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
        {handoffs.map((handoff) => (
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
