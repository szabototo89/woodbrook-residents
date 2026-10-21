import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { getHandoff, handoffs } from './handoffs';
import { HandoffsPage } from './HandoffsPage';
import { HandoffDetailPage } from './HandoffDetailPage';
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

test('an empty handoff index explains where documents belong', () => {
  const markup = renderToStaticMarkup(<HandoffsPage documents={[]} />);
  expect(markup).toContain('No handoffs yet');
  expect(markup).toContain('docs/handoffs/&lt;feature-slug&gt;/index.mdx');
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
  expect(markup).toContain('@startuml');
  expect(markup).toContain('C4/C4_Context');
  expect(markup).toContain('C4 architecture diagram');
  expect(markup).toContain('Open full size');
  expect(markup).toContain('href="#/"');
});
