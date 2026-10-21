import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { getHandoff, handoffs } from './handoffs';
import { HandoffsPage } from './HandoffsPage';
import { HandoffDetailPage } from './HandoffDetailPage';
import { HandoffPre } from './HandoffPre';
import { HandoffViewer } from './HandoffViewer';

test('the standalone viewer has a stable server-rendered index', () => {
  expect(renderToStaticMarkup(createElement(HandoffViewer))).toContain(
    'Repository notebook',
  );
});

test('the catalog discovers repository MDX documents and resolves known slugs only', () => {
  expect(handoffs.map((handoff) => handoff.title)).toContain(
    'Browseable agent handoffs',
  );
  expect(getHandoff('agent-handoffs')?.slug).toBe('agent-handoffs');
  expect(getHandoff('../HANDOFF')).toBeUndefined();
});

test('the handoff index links the document with its summary', () => {
  const markup = renderToStaticMarkup(createElement(HandoffsPage));
  expect(markup).toContain('Agent handoffs');
  expect(markup).toContain('href="#/agent-handoffs"');
  expect(markup).toContain('Repository MDX documents');
});

test('the MDX reader renders the real handoff with tables, disabled checklists and architecture source', () => {
  const markup = renderToStaticMarkup(
    createElement(HandoffDetailPage, {
      handoff: getHandoff('agent-handoffs')!,
    }),
  );
  expect(markup).toContain('Current state');
  expect(markup).toContain('<table>');
  expect(markup).toContain('type="checkbox"');
  expect(markup).toContain('disabled=""');
  expect(markup).toContain('C4Context');
  expect(markup).toContain('href="#/"');
});

test('ordinary code remains code and Mermaid fences render with accessible source fallback', () => {
  expect(
    renderToStaticMarkup(
      <HandoffPre>
        <code className="language-sh">bun run build</code>
      </HandoffPre>,
    ),
  ).toContain('<pre><code class="language-sh">bun run build</code></pre>');
  expect(renderToStaticMarkup(<HandoffPre>plain</HandoffPre>)).toBe(
    '<pre>plain</pre>',
  );
  const diagram = renderToStaticMarkup(
    <HandoffPre>
      <code className="language-mermaid">C4Context</code>
    </HandoffPre>,
  );
  expect(diagram).toContain('Rendering architecture diagram');
  expect(diagram).toContain('Diagram source');
  expect(diagram).toContain('C4Context');
});
