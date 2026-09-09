import { contentSnapshotSchema } from './contentSchemas';
import type { ContentSnapshot } from './contentTypes';

export type ContentSourceName = 'google-sheets' | 'strapi';

export interface ContentSource {
  readonly name: ContentSourceName;
  loadSnapshot(): Promise<ContentSnapshot>;
}

function findDuplicate(values: string[]) {
  const seen = new Set<string>();

  return values.find((value) => {
    if (seen.has(value)) {
      return true;
    }

    seen.add(value);
    return false;
  });
}

function validateCollectionIdentity(
  collectionName: string,
  items: Array<{ documentId: string; slug: string }>,
) {
  const duplicateId = findDuplicate(items.map((item) => item.documentId));
  if (duplicateId) {
    throw new Error(
      `${collectionName} contains duplicate record ID "${duplicateId}".`,
    );
  }

  const duplicateSlug = findDuplicate(items.map((item) => item.slug));
  if (duplicateSlug) {
    throw new Error(
      `${collectionName} contains duplicate slug "${duplicateSlug}".`,
    );
  }
}

function validateSnapshotData(input: unknown): ContentSnapshot {
  const snapshot = contentSnapshotSchema.parse(input);

  validateCollectionIdentity('Updates', snapshot.updates);
  validateCollectionIdentity('Projects', snapshot.projects);
  validateCollectionIdentity('Events', snapshot.events);
  validateCollectionIdentity('Consultations', snapshot.surveys);
  validateCollectionIdentity('Local_Info', snapshot.resources);

  const projectIds = new Set(
    snapshot.projects.map((project) => project.documentId),
  );
  const invalidRelation = snapshot.surveys.find(
    (survey) =>
      survey.relatedProjectId && !projectIds.has(survey.relatedProjectId),
  );

  if (invalidRelation) {
    throw new Error(
      `Consultation "${invalidRelation.documentId}" refers to missing project "${invalidRelation.relatedProjectId}".`,
    );
  }

  return snapshot;
}

export function validateContentSnapshot(
  input: unknown,
  sourceName: ContentSourceName,
): ContentSnapshot {
  try {
    return validateSnapshotData(input);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${sourceName} content validation failed: ${message}`, {
      cause: error,
    });
  }
}
