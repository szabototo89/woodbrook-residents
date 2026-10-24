// @vitest-environment happy-dom
import { afterEach, expect, test, vi } from 'vitest';
import type { ReactNode } from 'react';

import { renderUi } from '../../test-utils/renderUi';
import type { Update } from '../content/contentTypes';
import { UpdateDetailPage } from './UpdateDetailPage';

type LinkProps = { to: string; children: ReactNode };

vi.mock('@tanstack/react-router', () => ({
  Link: (props: LinkProps) => <a href={props.to}>{props.children}</a>,
}));

let update: Update | undefined;
vi.mock('../../routes/updates/$slug', () => ({
  Route: { useLoaderData: () => update },
}));

const sample: Update = {
  documentId: 'sample-update',
  title: 'Sample update',
  slug: 'sample-update',
  summary: 'Sample summary',
  body: '',
  kind: 'news',
  publishedOn: '2026-10-02',
  sourceName: 'Sample source',
  sourceUrl: 'https://example.com/source',
  sourceReviewedOn: '2026-10-02',
  featured: false,
};

let unmount: (() => void) | undefined;
afterEach(() => unmount?.());

function renderUpdate(body: string, fields: Partial<Update> = {}) {
  update = { ...sample, body, ...fields };
  const rendered = renderUi(<UpdateDetailPage />);
  unmount = rendered.unmount;
  return rendered.container;
}

test('renders Markdown headings, emphasis, lists, quotes, and links as read-only content', () => {
  const container = renderUpdate(
    '## Residents are calling for\n\n- **Parking:** More spaces\n- *Transport:* Better access\n\n> Infrastructure creates communities.\n\n### Next steps\n\n1. Read the proposal\n2. [Read the source](https://example.com/proposal)',
  );

  expect(container.querySelector('h2')?.textContent).toBe(
    'Residents are calling for',
  );
  expect(container.querySelector('h3')?.textContent).toBe('Next steps');
  expect(container.querySelector('strong')?.textContent).toBe('Parking:');
  expect(container.querySelector('em')?.textContent).toBe('Transport:');
  expect(container.querySelectorAll('ul li')).toHaveLength(2);
  expect(container.querySelectorAll('ol li')).toHaveLength(2);
  expect(container.querySelector('blockquote')?.textContent?.trim()).toBe(
    'Infrastructure creates communities.',
  );
  const source = Array.from(container.querySelectorAll('a')).find(
    (link) => link.textContent === 'Read the source',
  );
  expect(source?.getAttribute('href')).toBe('https://example.com/proposal');
  expect(
    container.querySelector('textarea, input, [contenteditable]'),
  ).toBeNull();
  expect(container.querySelector('aside')?.textContent).toContain(
    'Sample source on 2 October 2026',
  );
});

test('keeps plain-text paragraphs and explicit Markdown line breaks readable', () => {
  const container = renderUpdate(
    'First paragraph.\n\nSecond paragraph.  \nAnother line.',
  );
  const paragraphs = container.querySelectorAll('.article-body > div > p');
  expect(paragraphs).toHaveLength(2);
  expect(paragraphs[0]?.textContent).toBe('First paragraph.');
  expect(paragraphs[1]?.querySelector('br')).not.toBeNull();
});

test('shows code as text and does not execute embedded HTML or unsafe links', () => {
  const container = renderUpdate(
    '`inline code`\n\n```text\n<script>alert(1)</script>\n```\n\n<img src=x onerror=alert(1)>\n\n[Unsafe](javascript:alert%281%29)',
  );
  expect(container.querySelector('p code')?.textContent).toBe('inline code');
  expect(container.querySelector('pre code')?.textContent).toContain(
    '<script>alert(1)</script>',
  );
  expect(container.querySelector('script, img')).toBeNull();
  expect(container.querySelector('a[href^="javascript:"]')).toBeNull();
});

test('keeps update imagery, credits, source attribution, and navigation', () => {
  const container = renderUpdate('Body text', {
    imagePath: '/images/example.jpg',
    imageAlt: 'Sample image',
    imageCredit: 'Sample photographer',
    imageCreditUrl: 'https://example.com/photo',
  });
  expect(container.querySelector('img')?.getAttribute('alt')).toBe(
    'Sample image',
  );
  expect(container.querySelector('figcaption a')?.getAttribute('href')).toBe(
    'https://example.com/photo',
  );
  expect(container.querySelector('aside a')?.getAttribute('href')).toBe(
    sample.sourceUrl,
  );
  expect(container.querySelector('header a')?.getAttribute('href')).toBe(
    '/updates',
  );
});

test('supports an image without optional alt text or credit', () => {
  const container = renderUpdate('', { imagePath: '/images/example.jpg' });
  expect(container.querySelector('img')?.getAttribute('alt')).toBe('');
  expect(container.querySelector('figcaption')).toBeNull();
});

test('offers a way back when the update is unavailable', () => {
  update = undefined;
  const rendered = renderUi(<UpdateDetailPage />);
  unmount = rendered.unmount;
  expect(rendered.container.querySelector('h1')?.textContent).toBe(
    'We couldn’t find that news article',
  );
  expect(rendered.container.querySelector('a')?.getAttribute('href')).toBe(
    '/updates',
  );
});
