import { expect, test } from 'vitest';

import { validateContentSnapshot } from './contentSource';
import type { ContentSnapshot } from './contentTypes';

const emptySnapshot: ContentSnapshot = {
  updates: [],
  projects: [],
  events: [],
  surveys: [],
  resources: [],
};

test('validateContentSnapshot rejects duplicate stable IDs with the collection name', () => {
  const project = {
    documentId: 'project-1',
    slug: 'project-1',
    title: 'Project one',
    category: 'community' as const,
    stage: 'active' as const,
    summary: 'Summary',
    details: 'Details',
    updatedOn: '2026-09-09',
    sourceName: 'Source',
    sourceUrl: 'https://example.com/project',
    sourceReviewedOn: '2026-09-09',
    featured: false,
  };

  expect(() =>
    validateContentSnapshot(
      { ...emptySnapshot, projects: [project, { ...project }] },
      'google-sheets',
    ),
  ).toThrow('Projects contains duplicate record ID "project-1".');
});

test('validateContentSnapshot rejects duplicate slugs with the collection name', () => {
  const project = {
    documentId: 'project-1',
    slug: 'shared-slug',
    title: 'Project one',
    category: 'community' as const,
    stage: 'active' as const,
    summary: 'Summary',
    details: 'Details',
    updatedOn: '2026-09-09',
    sourceName: 'Source',
    sourceUrl: 'https://example.com/project',
    sourceReviewedOn: '2026-09-09',
    featured: false,
  };

  expect(() =>
    validateContentSnapshot(
      {
        ...emptySnapshot,
        projects: [project, { ...project, documentId: 'project-2' }],
      },
      'google-sheets',
    ),
  ).toThrow('Projects contains duplicate slug "shared-slug".');
});

test('validateContentSnapshot accepts a consultation relation to a published project', () => {
  const snapshot = validateContentSnapshot(
    {
      ...emptySnapshot,
      projects: [
        {
          documentId: 'project-1',
          slug: 'project-1',
          title: 'Project one',
          category: 'community' as const,
          stage: 'active' as const,
          summary: 'Summary',
          details: 'Details',
          updatedOn: '2026-09-09',
          sourceName: 'Source',
          sourceUrl: 'https://example.com/project',
          sourceReviewedOn: '2026-09-09',
          featured: false,
        },
      ],
      surveys: [
        {
          documentId: 'consultation-1',
          slug: 'consultation-1',
          title: 'Consultation',
          stage: 'open',
          summary: 'Summary',
          sourceName: 'Source',
          sourceUrl: 'https://example.com/consultation',
          sourceReviewedOn: '2026-09-09',
          relatedProjectId: 'project-1',
        },
      ],
    },
    'google-sheets',
  );

  expect(snapshot.surveys).toHaveLength(1);
});

test('validateContentSnapshot rejects a consultation relation to an unpublished project', () => {
  expect(() =>
    validateContentSnapshot(
      {
        ...emptySnapshot,
        surveys: [
          {
            documentId: 'consultation-1',
            slug: 'consultation-1',
            title: 'Consultation',
            stage: 'open',
            summary: 'Summary',
            sourceName: 'Source',
            sourceUrl: 'https://example.com/consultation',
            sourceReviewedOn: '2026-09-09',
            relatedProjectId: 'missing-project',
          },
        ],
      },
      'google-sheets',
    ),
  ).toThrow(
    'Consultation "consultation-1" refers to missing project "missing-project".',
  );
});
