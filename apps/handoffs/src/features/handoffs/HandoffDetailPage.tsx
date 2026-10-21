import { ArrowLeft } from 'lucide-react';
import type { handoffs } from './handoffs';
import { PlantUmlDiagram } from './PlantUmlDiagram';
import { AppearanceGallery } from './AppearanceGallery';
import { HandoffMetadata } from './HandoffMetadata';
import { HandoffOutline } from './HandoffOutline';
import { HandoffTable } from './HandoffTable';

const components = {
  table: HandoffTable,
  PlantUmlDiagram,
  AppearanceGallery,
};

export function HandoffDetailPage(props: {
  handoff: (typeof handoffs)[number];
}) {
  const Content = props.handoff.Content;
  return (
    <main id="main-content" className="handoff-detail shell">
      <a className="handoff-back" href="#/">
        <ArrowLeft size={15} aria-hidden="true" />
        All handoffs
      </a>
      <div className="handoff-reading-layout">
        <HandoffOutline slug={props.handoff.slug} />
        <article className="handoff-document">
          <header className="handoff-document-header">
            <p className="eyebrow">Agent handoff</p>
            <h1>{props.handoff.title}</h1>
            <p className="handoff-summary">{props.handoff.summary}</p>
            <HandoffMetadata metadata={props.handoff} />
          </header>
          <Content components={components} />
        </article>
      </div>
    </main>
  );
}
