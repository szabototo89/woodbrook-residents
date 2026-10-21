import type { handoffs } from './handoffs';
import { HandoffPre } from './HandoffPre';
import { MermaidDiagram } from './MermaidDiagram';
import { AppearanceGallery } from './AppearanceGallery';

const components = { pre: HandoffPre, MermaidDiagram, AppearanceGallery };

export function HandoffDetailPage(props: {
  handoff: (typeof handoffs)[number];
}) {
  const Content = props.handoff.Content;
  return (
    <main id="main-content" className="handoff-detail shell">
      <a className="handoff-back" href="#/">
        ← All handoffs
      </a>
      <article className="handoff-document">
        <Content components={components} />
      </article>
    </main>
  );
}
