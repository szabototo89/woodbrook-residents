// @vitest-environment happy-dom
import { expect, test, vi } from 'vitest';
import type { ReactNode } from 'react';

import { renderUi } from '../../test-utils/renderUi';
import { LocalServiceCard } from './LocalServiceCard';
import { LocalHighlights } from './LocalHighlights';
import type { Resource } from '../content/contentTypes';

type FakeLinkProps = {
  to: string;
  params?: { slug?: string };
  children?: ReactNode;
  className?: string;
  'aria-label'?: string;
};

function FakeLink(props: FakeLinkProps) {
  const slug = props.params?.slug;
  const href = slug ? props.to.replace('$slug', slug) : props.to;
  return (
    <a href={href} className={props.className} aria-label={props['aria-label']}>
      {props.children}
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
    <LocalHighlights
      resources={[
        {
          ...resource,
          featured: true,
          details: [
            {
              id: 1,
              label: 'Opening hours',
              value: 'Weekdays',
              showOnCard: true,
            },
          ],
        },
        {
          ...resource,
          documentId: 'r2',
          title: 'Bin schedule',
          slug: 'bin-schedule',
          featured: true,
          details: [
            {
              id: 2,
              label: 'Applicability',
              value: 'Local customers',
              showOnCard: true,
            },
          ],
          collectionDates: [
            { id: 1, date: '2026-09-15', stream: 'recycling' },
            { id: 2, date: '2026-09-22', stream: 'waste-compost' },
          ],
        },
      ]}
      today="2026-09-10"
    />,
  );
  const action = container.querySelector('.local-highlight-action');
  expect(action?.getAttribute('href')).toContain('test-service');
  expect(action?.className ?? '').toMatch(/card-stretched-link/);
  expect(container.querySelectorAll('.local-highlight-action')).toHaveLength(2);
  expect(container.textContent).toContain('Weekdays');
  expect(container.textContent).toContain('Local customers');
  expect(container.querySelector('time')).not.toBeNull();
  unmount();
});

test('local service card shows the out-of-hours badge when available', () => {
  const { container, unmount } = renderUi(
    <LocalServiceCard resource={{ ...resource, outOfHours: true }} />,
  );

  expect(container.textContent).toContain('Out-of-hours contact');
  unmount();
});

test('local service card omits the call action without a phone number', () => {
  const { container, unmount } = renderUi(
    <LocalServiceCard resource={{ ...resource, phone: undefined }} />,
  );

  expect(
    container.querySelector('.resource-actions a[href^="tel:"]'),
  ).toBeNull();
  expect(container.querySelector('h2 a')).not.toBeNull();
  unmount();
});

test('local service card lists details chosen for the card', () => {
  const { container, unmount } = renderUi(
    <LocalServiceCard
      resource={{
        ...resource,
        details: [
          { id: 1, label: 'Address', value: 'Main Street', showOnCard: true },
          { id: 2, label: 'Internal', value: 'Hidden', showOnCard: false },
        ],
      }}
    />,
  );

  expect(container.textContent).toContain('Main Street');
  expect(container.textContent).not.toContain('Hidden');
  unmount();
});

test('local highlights render nothing without featured resources', () => {
  const { container, unmount } = renderUi(
    <LocalHighlights resources={[resource]} today="2026-09-10" />,
  );

  expect(container.querySelector('.local-highlights')).toBeNull();
  unmount();
});
