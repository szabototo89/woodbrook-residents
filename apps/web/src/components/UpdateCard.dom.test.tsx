// @vitest-environment happy-dom
import { expect, test, vi } from 'vitest';
import type { ReactNode } from 'react';

import { renderUi } from '../test-utils/renderUi';
import { UpdateCard } from './UpdateCard';
import type { Update } from '../features/content/contentTypes';

type FakeLinkProps = {
  to: string;
  params?: { slug?: string };
  children?: ReactNode;
  className?: string;
  'aria-label'?: string;
};

function FakeLink({
  to,
  params,
  children,
  className,
  'aria-label': ariaLabel,
}: FakeLinkProps) {
  const slug = params?.slug;
  const href = slug ? to.replace('$slug', slug) : to;
  return (
    <a href={href} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  );
}

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    Link: FakeLink,
  };
});

const update: Update = {
  documentId: 'u1',
  title: 'Test update',
  slug: 'test-update',
  summary: 'Summary text',
  body: 'Body text',
  kind: 'news',
  publishedOn: '2026-09-10',
  sourceName: 'Council',
  sourceUrl: 'https://example.com',
  sourceReviewedOn: '2026-09-10',
  featured: false,
};

test('update card title link covers the whole card', () => {
  const { container, unmount } = renderUi(<UpdateCard update={update} />);
  const titleLink = container.querySelector('h3 a');
  expect(titleLink?.getAttribute('href')).toContain('test-update');
  expect(titleLink?.className ?? '').toMatch(/card-stretched-link/);
  unmount();
});

test('update card shows its image when provided', () => {
  const { container, unmount } = renderUi(
    <UpdateCard
      update={{
        ...update,
        imagePath: '/images/example.jpg',
        imageAlt: 'Example',
      }}
    />,
  );

  expect(container.querySelector('article img')?.getAttribute('src')).toBe(
    '/images/example.jpg',
  );
  unmount();
});

test('update card leaves image alt empty when none is provided', () => {
  const { container, unmount } = renderUi(
    <UpdateCard update={{ ...update, imagePath: '/images/example.jpg' }} />,
  );

  expect(container.querySelector('article img')?.getAttribute('alt')).toBe('');
  unmount();
});
