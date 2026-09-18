// @vitest-environment happy-dom
import { expect, test, vi } from 'vitest';

import { renderUi } from '../test-utils/renderUi';
import { EventCard } from './EventCard';
import { ProjectCard } from './ProjectCard';
import { SurveyCard } from './SurveyCard';
import type { CommunityEvent } from '../features/content/contentTypes';
import type { Project } from '../features/content/contentTypes';
import type { Survey } from '../features/content/contentTypes';

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

const project: Project = {
  documentId: 'p1',
  title: 'Test project',
  slug: 'test-project',
  summary: 'Summary',
  stage: 'active',
  category: 'housing',
  sourceName: 'Council',
  sourceUrl: 'https://example.com',
  sourceReviewedOn: '2026-09-10',
};

const event: CommunityEvent = {
  documentId: 'e1',
  title: 'Test event',
  slug: 'test-event',
  summary: 'Summary',
  startsAt: '2026-09-20T10:00:00.000Z',
  location: 'Shankill',
  sourceUrl: 'https://example.com',
  sourceReviewedOn: '2026-09-10',
  featured: false,
};

const survey: Survey = {
  documentId: 's1',
  title: 'Test consultation',
  slug: 'test-survey',
  summary: 'Summary',
  stage: 'open',
  sourceName: 'Council',
  sourceUrl: 'https://example.com',
  sourceReviewedOn: '2026-09-10',
};

test('project card title link covers the whole card', () => {
  const { container, unmount } = renderUi(<ProjectCard project={project} />);
  expect(container.querySelector('h3 a')?.className ?? '').toMatch(
    /card-stretched-link/,
  );
  expect(container.querySelector('article img')?.parentElement?.tagName).not.toBe(
    'A',
  );
  unmount();
});

test('event card title link covers the whole card', () => {
  const { container, unmount } = renderUi(<EventCard event={event} />);
  expect(container.querySelector('h2 a, h3 a')?.className ?? '').toMatch(
    /card-stretched-link/,
  );
  unmount();
});

test('survey card title link covers the whole card', () => {
  const { container, unmount } = renderUi(<SurveyCard survey={survey} />);
  expect(container.querySelector('h2 a')?.className ?? '').toMatch(
    /card-stretched-link/,
  );
  unmount();
});
