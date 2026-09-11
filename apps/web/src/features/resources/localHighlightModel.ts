import type { Resource } from '../content/contentTypes';
import {
  collectionStreamLabels,
  getNextCollectionDates,
} from './collectionScheduleUtils';

export type LocalHighlight = {
  resource: Resource;
  summary?: string;
  facts: Array<{
    label: string;
    value: string;
    dateTime?: string;
  }>;
  note?: string;
  actionLabel: string;
};

function createHighlight(
  resource: Resource,
  today: string,
): LocalHighlight | undefined {
  const applicability = resource.details.find(
    (detail) => detail.label.toLocaleLowerCase('en-IE') === 'applicability',
  )?.value;

  if (resource.collectionDates.length > 0) {
    const facts = getNextCollectionDates(resource.collectionDates, today)
      .filter(
        (collection): collection is typeof collection & { date: string } =>
          Boolean(collection.date),
      )
      .map((collection) => ({
        label: collectionStreamLabels[collection.stream],
        value: collection.date,
        dateTime: collection.date,
      }));

    if (facts.length === 0) {
      return undefined;
    }

    return {
      resource,
      facts,
      note: applicability,
      actionLabel: 'View full schedule',
    };
  }

  return {
    resource,
    summary: resource.description,
    facts: resource.details
      .filter(
        (detail) =>
          detail.showOnCard &&
          detail.label.toLocaleLowerCase('en-IE') !== 'applicability',
      )
      .slice(0, 2)
      .map((detail) => ({ label: detail.label, value: detail.value })),
    note: applicability,
    actionLabel: 'View details',
  };
}

export function getLocalHighlights(
  resources: Resource[],
  today: string,
  limit = 3,
) {
  return resources
    .filter((resource) => resource.featured)
    .map((resource) => createHighlight(resource, today))
    .filter((highlight): highlight is LocalHighlight => Boolean(highlight))
    .slice(0, limit);
}
