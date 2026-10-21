import { BookOpen, FileQuestion, FolderOpen } from 'lucide-react';
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
        <a href="#/">
          <BookOpen size={16} aria-hidden="true" />
          Agent handoffs
        </a>
        <span>
          <FolderOpen size={13} aria-hidden="true" />
          docs/handoffs
        </span>
      </header>
      {!slug ? (
        <HandoffsPage />
      ) : handoff ? (
        <HandoffDetailPage handoff={handoff} />
      ) : (
        <main id="main-content" className="handoffs-page shell">
          <FileQuestion
            className="handoff-empty-icon"
            size={20}
            aria-hidden="true"
          />
          <h1>Handoff not found</h1>
          <p>That document is not in this repository.</p>
          <a href="#/">All handoffs</a>
        </main>
      )}
    </>
  );
}
