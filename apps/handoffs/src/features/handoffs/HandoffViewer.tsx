import { useSyncExternalStore } from 'react';
import { getHandoff } from './handoffs';
import { HandoffsPage } from './HandoffsPage';
import { HandoffDetailPage } from './HandoffDetailPage';

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

function currentSlug() {
  return window.location.hash.replace(/^#\/?/, '');
}

export function HandoffViewer() {
  const slug = useSyncExternalStore(subscribe, currentSlug, () => '');
  const handoff = getHandoff(slug);
  return (
    <>
      <header className="viewer-header">
        <a href="#/">Agent handoffs</a>
        <span>Repository notebook</span>
      </header>
      {!slug ? (
        <HandoffsPage />
      ) : handoff ? (
        <HandoffDetailPage handoff={handoff} />
      ) : (
        <main id="main-content" className="handoffs-page shell">
          <h1>Handoff not found</h1>
          <p>That document is not in this repository.</p>
          <a href="#/">All handoffs</a>
        </main>
      )}
    </>
  );
}
