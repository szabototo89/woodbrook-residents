// @vitest-environment happy-dom
import { expect, test, vi } from 'vitest';

import { renderUi } from '../test-utils/renderUi';
import { UpdateCard } from './UpdateCard';
import type { Update } from '../features/content/contentTypes';

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    Link: ({ to, params, children, className, ...rest }: any) => {
      const href =
        typeof to === 'string' && (params as any)?.slug
          ? (to as string).replace('$slug', (params as any).slug)
          : to;
      return (
        <a href={href} className={className} {...rest}>
          {children}
        </a>
      );
    },
  };
});

const update: Update = {
  documentId: 'u1',
  title: 'Test update',
  slug: 'test-update',
  summary: 'Summary text',
  kind: 'notice',
  publishedOn: '2026-09-10',
  sourceName: 'Council',
  sourceUrl: 'https://example.com',
  sourceReviewedOn: '2026-09-10',
};

test('update card title link covers the whole card', () => {
  const { container, unmount } = renderUi(<UpdateCard update={update} />);
  const titleLink = container.querySelector('h3 a');
  expect(titleLink?.getAttribute('href')).toContain('test-update');
  expect(titleLink?.className ?? '').toMatch(/card-stretched-link/);
  unmount();
});
