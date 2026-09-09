import type { Resource } from '../content/contentTypes';

export type CollectionDate = Resource['collectionDates'][number];
export type CollectionStream = CollectionDate['stream'];

export const collectionStreamLabels: Record<CollectionStream, string> = {
  recycling: 'Recycling',
  'waste-compost': 'Waste and compost',
};

export function getDublinCalendarDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-IE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Europe/Dublin',
  }).formatToParts(now);
  const partValue = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value;

  return `${partValue('year')}-${partValue('month')}-${partValue('day')}`;
}

export function getNextCollectionDates(
  collectionDates: CollectionDate[],
  today: string,
) {
  return (Object.keys(collectionStreamLabels) as CollectionStream[]).map(
    (stream) => ({
      stream,
      date: collectionDates
        .filter(
          (collectionDate) =>
            collectionDate.stream === stream && collectionDate.date >= today,
        )
        .sort((left, right) => left.date.localeCompare(right.date))[0]?.date,
    }),
  );
}
