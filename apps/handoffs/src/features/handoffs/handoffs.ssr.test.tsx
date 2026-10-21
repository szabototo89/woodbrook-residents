import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { getHandoff, handoffs } from './handoffs';
import { HandoffsPage } from './HandoffsPage';
import { HandoffDetailPage } from './HandoffDetailPage';
import { HandoffViewer } from './HandoffViewer';

type Handoff = (typeof handoffs)[number];

function handoff(
  overrides: Partial<Handoff> & Pick<Handoff, 'slug' | 'title' | 'summary'>,
): Handoff {
  return { Content: () => null, ...overrides };
}

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

test('every handoff records its coding agent and session', () => {
  for (const handoff of handoffs) {
    expect(handoff.agent?.trim(), `${handoff.slug} coding agent`).toBeTruthy();
    expect(handoff.session?.trim(), `${handoff.slug} session`).toBeTruthy();
  }
});

test('the handoff index links the document with its summary', () => {
  const markup = renderToStaticMarkup(createElement(HandoffsPage));
  expect(markup).toContain('Agent handoffs');
  expect(markup).toContain('href="#/agent-handoffs"');
  expect(markup).toContain('Repository MDX documents');
  expect(markup).toContain('type="search"');
  expect(markup).toContain('Search handoffs');
});

test('the handoff index leads with status and recency, newest first', () => {
  const markup = renderToStaticMarkup(
    <HandoffsPage
      documents={[
        handoff({
          slug: 'older',
          title: 'Older handoff',
          summary: 'Older summary.',
          status: 'complete',
          updatedAt: '2026-10-20T10:00:00Z',
        }),
        handoff({
          slug: 'newer',
          title: 'Newer handoff',
          summary: 'Newer summary.',
          status: 'blocked',
          updatedAt: '2026-10-21T12:30:00Z',
        }),
        handoff({
          slug: 'undated',
          title: 'Undated handoff',
          summary: 'Undated summary.',
        }),
      ]}
    />,
  );
  expect(markup.indexOf('Newer handoff')).toBeLessThan(
    markup.indexOf('Older handoff'),
  );
  expect(markup.indexOf('Older handoff')).toBeLessThan(
    markup.indexOf('Undated handoff'),
  );
  expect(markup).toContain('21 Oct 2026, 12:30 UTC');
  expect(markup).toContain('handoff-status--blocked');
  expect(markup).toContain('>Blocked<');
  expect(markup).toContain('Update not recorded');
  expect(markup).toContain('3 handoffs');
  expect(markup).toContain('Newest first');
  expect(markup).toContain('Open handoff');
  expect(markup).toContain('aria-label="Newer handoff — open handoff"');
  expect(markup).not.toContain('↗');
  expect(markup).toContain('<ul class="handoff-list">');
  expect(markup).toContain('<li>');
});

test('the handoff index handles a single document and malformed dates', () => {
  const markup = renderToStaticMarkup(
    <HandoffsPage
      documents={[
        handoff({
          slug: 'only',
          title: 'Only handoff',
          summary: 'Only summary.',
          status: 'ready for review',
          updatedAt: 'not-a-date',
        }),
      ]}
    />,
  );
  expect(markup).toContain('1 handoff');
  expect(markup).not.toContain('1 handoffs');
  expect(markup).toContain('Ready for review');
  expect(markup).toContain('Update not recorded');
  expect(markup).not.toContain('not-a-date');
});

test('an empty handoff index explains where documents belong', () => {
  const markup = renderToStaticMarkup(<HandoffsPage documents={[]} />);
  expect(markup).toContain('No handoffs yet');
  expect(markup).toContain('docs/handoffs/&lt;feature-slug&gt;/index.mdx');
  expect(markup).not.toContain('type="search"');
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
