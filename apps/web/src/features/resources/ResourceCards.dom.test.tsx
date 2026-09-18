// @vitest-environment happy-dom
import { expect, test, vi } from 'vitest';

import { renderUi } from '../../test-utils/renderUi';
import { LocalServiceCard } from './LocalServiceCard';
import { LocalHighlights } from './LocalHighlights';
import type { Resource } from '../content/contentTypes';

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

const resource: Resource = {
  documentId: 'r1',
  title: 'Test service',
  slug: 'test-service',
  category: 'health',
  serviceType: 'GP practice',
  providerType: 'business',
  description: 'Helpful description',
  phone: '01 234 5678',
  outOfHours: false,
  featured: false,
  details: [],
  collectionDates: [],
  displayOrder: 1,
  sourceName: 'Source',
  sourceUrl: 'https://example.com',
  sourceReviewedOn: '2026-09-10',
};

test('local service card title link covers the whole card', () => {
  const { container, unmount } = renderUi(
    <LocalServiceCard resource={resource} />,
  );
  expect(container.querySelector('h2 a')?.className ?? '').toMatch(
    /card-stretched-link/,
  );
  expect(
    container.querySelector('.resource-actions a[href^="tel:"]'),
  ).not.toBeNull();
  unmount();
});

test('local highlight action covers the highlight card', () => {
  const { container, unmount } = renderUi(
    <LocalHighlights resources={[{ ...resource, featured: true }]} today="2026-09-10" />,
  );
  const action = container.querySelector('.local-highlight-action');
  expect(action?.getAttribute('href')).toContain('test-service');
  expect(action?.className ?? '').toMatch(/card-stretched-link/);
  unmount();
});
