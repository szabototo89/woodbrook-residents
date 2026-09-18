// @vitest-environment happy-dom
import { expect, test, vi } from 'vitest';
import type { ReactNode } from 'react';

import { renderUi } from '../test-utils/renderUi';
import { EventCard } from './EventCard';
import { ProjectCard } from './ProjectCard';
import { SurveyCard } from './SurveyCard';
import type { CommunityEvent } from '../features/content/contentTypes';
import type { Project } from '../features/content/contentTypes';
import type { Survey } from '../features/content/contentTypes';

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

const project: Project = {
  documentId: 'p1',
  title: 'Test project',
  slug: 'test-project',
  summary: 'Summary',
  details: 'Details',
  updatedOn: '2026-09-10',
  stage: 'active',
  category: 'housing',
  sourceName: 'Council',
  sourceUrl: 'https://example.com',
  sourceReviewedOn: '2026-09-10',
  featured: false,
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
  expect(
    container.querySelector('article img')?.parentElement?.tagName,
  ).not.toBe('A');
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

test('project card shows its image and next step when provided', () => {
  const { container, unmount } = renderUi(
    <ProjectCard
      project={{
        ...project,
        imagePath: '/images/example.jpg',
        imageAlt: 'Example',
        nextStep: 'Planning decision in October',
      }}
    />,
  );

  expect(container.querySelector('article img')?.getAttribute('src')).toBe(
    '/images/example.jpg',
  );
  expect(container.textContent).toContain('Planning decision in October');
  unmount();
});

test('project card leaves image alt empty when none is provided', () => {
  const { container, unmount } = renderUi(
    <ProjectCard project={{ ...project, imagePath: '/images/example.jpg' }} />,
  );

  expect(container.querySelector('article img')?.getAttribute('alt')).toBe('');
  unmount();
});

test('survey card shows closing information for open consultations', () => {
  const { container, unmount } = renderUi(
    <SurveyCard survey={{ ...survey, closesOn: '2026-10-01' }} />,
  );

  expect(container.querySelector('.survey-date')?.textContent).toContain(
    'Closes',
  );
  unmount();
});

test('survey card marks closed consultations as closed', () => {
  const { container, unmount } = renderUi(
    <SurveyCard
      survey={{ ...survey, stage: 'closed', closesOn: '2026-08-01' }}
    />,
  );

  expect(container.querySelector('.survey-date')?.textContent).toContain(
    'Closed',
  );
  unmount();
});
