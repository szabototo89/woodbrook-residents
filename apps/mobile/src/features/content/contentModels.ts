import type { ContentSnapshot, Resource } from './contentTypes.js';

export type CollectionKey =
  'updates' | 'projects' | 'events' | 'surveys' | 'resources';

export type Route =
  | { name: 'home' }
  | { name: 'help' }
  | { name: 'more' }
  | { name: 'collection'; collection: CollectionKey }
  | { name: 'detail'; collection: CollectionKey; slug: string };

export type CardModel = {
  slug: string;
  title: string;
  summary: string;
  meta: string;
};

export type CollectionModel = {
  eyebrow: string;
  title: string;
  intro: string;
  empty: string;
  cards: CardModel[];
};

export type DetailModel = {
  backLabel: string;
  eyebrow: string;
  title: string;
  summary: string;
  facts: Array<{ label: string; value: string }>;
  paragraphs: string[];
  sourceName: string;
  sourceUrl: string;
  reviewedOn: string;
  action?: { label: string; url: string };
  contact?: { phone?: string; email?: string; url?: string };
};

const collectionCopy: Record<CollectionKey, Omit<CollectionModel, 'cards'>> = {
  updates: {
    eyebrow: 'Stay informed',
    title: 'Updates',
    intro:
      'Clear, source-linked notes on transport, planning, public spaces, and the practical changes residents need to know about.',
    empty: 'No updates are available right now.',
  },
  projects: {
    eyebrow: 'Follow local change',
    title: 'Projects',
    intro:
      'A simple record of what is proposed, active, completed, or still being monitored — with the latest known next step and an official source.',
    empty: 'No projects are available right now.',
  },
  events: {
    eyebrow: 'Meet and take part',
    title: 'Events',
    intro:
      'Confirmed local dates from organisers and public bodies. Always check the linked organiser page before travelling.',
    empty: 'No events are available right now.',
  },
  surveys: {
    eyebrow: 'Have your say',
    title: 'Consultations',
    intro:
      'Open opportunities to respond, plus a record of relevant closed consultations so important context does not disappear.',
    empty: 'No consultations are available right now.',
  },
  resources: {
    eyebrow: 'Useful nearby',
    title: 'Local information',
    intro:
      'Find a curated starting set of nearby public services, community contacts, and businesses—then check the source and contact the provider directly.',
    empty: 'No local information is available right now.',
  },
};

const readableDate = (value: string) =>
  new Intl.DateTimeFormat('en-IE', { dateStyle: 'medium' }).format(
    new Date(value),
  );

const readableDateTime = (value: string) =>
  new Intl.DateTimeFormat('en-IE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

export function getResourceCategories(resources: Resource[]) {
  return [...new Set(resources.map((resource) => resource.category))].sort();
}

export function filterResources(
  resources: Resource[],
  query: string,
  category: string,
  outOfHoursOnly: boolean,
) {
  const normalizedQuery = query.trim().toLocaleLowerCase('en-IE');
  return resources.filter((resource) => {
    if (category !== 'all' && resource.category !== category) return false;
    if (outOfHoursOnly && !resource.outOfHours) return false;
    if (!normalizedQuery) return true;
    return [
      resource.title,
      resource.category,
      resource.serviceType,
      resource.description,
      resource.phone,
      resource.email,
      resource.documentLabel,
      ...resource.details.flatMap(({ label, value }) => [label, value]),
    ]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase('en-IE')
      .includes(normalizedQuery);
  });
}

export function getCollectionModel(
  content: ContentSnapshot,
  collection: CollectionKey,
): CollectionModel {
  const cards =
    collection === 'updates'
      ? content.updates.map((item) => ({
          slug: item.slug,
          title: item.title,
          summary: item.summary,
          meta: `${item.kind} · ${readableDate(item.publishedOn)}`,
        }))
      : collection === 'projects'
        ? content.projects.map((item) => ({
            slug: item.slug,
            title: item.title,
            summary: item.summary,
            meta: `${item.stage} · ${item.category}`,
          }))
        : collection === 'events'
          ? content.events.map((item) => ({
              slug: item.slug,
              title: item.title,
              summary: item.summary,
              meta: `${readableDateTime(item.startsAt)} · ${item.location}`,
            }))
          : collection === 'surveys'
            ? content.surveys.map((item) => ({
                slug: item.slug,
                title: item.title,
                summary: item.summary,
                meta: item.closesOn
                  ? `${item.stage} · closes ${readableDate(item.closesOn)}`
                  : item.stage,
              }))
            : content.resources.map((item) => ({
                slug: item.slug,
                title: item.title,
                summary: item.description,
                meta: `${item.category} · ${item.serviceType}`,
              }));
  return { ...collectionCopy[collection], cards };
}

export function getDetailModel(
  content: ContentSnapshot,
  collection: CollectionKey,
  slug: string,
): DetailModel | undefined {
  if (collection === 'updates') {
    const item = content.updates.find((entry) => entry.slug === slug);
    return item
      ? {
          backLabel: 'Back to updates',
          eyebrow: `${item.kind} · ${readableDate(item.publishedOn)}`,
          title: item.title,
          summary: item.summary,
          facts: [],
          paragraphs: item.body.split(/\n\s*\n/).filter(Boolean),
          sourceName: item.sourceName,
          sourceUrl: item.sourceUrl,
          reviewedOn: readableDate(item.sourceReviewedOn),
        }
      : undefined;
  }
  if (collection === 'projects') {
    const item = content.projects.find((entry) => entry.slug === slug);
    return item
      ? {
          backLabel: 'Back to projects',
          eyebrow: `${item.stage} · ${item.category}`,
          title: item.title,
          summary: item.summary,
          facts: [
            { label: 'Updated', value: readableDate(item.updatedOn) },
            ...(item.nextStep
              ? [{ label: 'Next step', value: item.nextStep }]
              : []),
          ],
          paragraphs: [item.details],
          sourceName: item.sourceName,
          sourceUrl: item.sourceUrl,
          reviewedOn: readableDate(item.sourceReviewedOn),
        }
      : undefined;
  }
  if (collection === 'events') {
    const item = content.events.find((entry) => entry.slug === slug);
    return item
      ? {
          backLabel: 'Back to events',
          eyebrow: readableDateTime(item.startsAt),
          title: item.title,
          summary: item.summary,
          facts: [
            { label: 'Starts', value: readableDateTime(item.startsAt) },
            ...(item.endsAt
              ? [{ label: 'Ends', value: readableDateTime(item.endsAt) }]
              : []),
            { label: 'Location', value: item.location },
          ],
          paragraphs: [],
          sourceName: 'Event organiser',
          sourceUrl: item.sourceUrl,
          reviewedOn: readableDate(item.sourceReviewedOn),
          action: item.bookingUrl
            ? { label: 'Book on the organiser site', url: item.bookingUrl }
            : undefined,
        }
      : undefined;
  }
  if (collection === 'surveys') {
    const item = content.surveys.find((entry) => entry.slug === slug);
    return item
      ? {
          backLabel: 'Back to consultations',
          eyebrow: item.stage,
          title: item.title,
          summary: item.summary,
          facts: [
            ...(item.opensOn
              ? [{ label: 'Opens', value: readableDate(item.opensOn) }]
              : []),
            ...(item.closesOn
              ? [{ label: 'Closes', value: readableDate(item.closesOn) }]
              : []),
          ],
          paragraphs: [],
          sourceName: item.sourceName,
          sourceUrl: item.sourceUrl,
          reviewedOn: readableDate(item.sourceReviewedOn),
          action:
            item.stage !== 'Closed' && item.responseUrl
              ? {
                  label: 'Respond on the official site',
                  url: item.responseUrl,
                }
              : undefined,
        }
      : undefined;
  }
  const item = content.resources.find((entry) => entry.slug === slug);
  return item
    ? {
        backLabel: 'Back to local information',
        eyebrow: `${item.category} · ${item.providerType}`,
        title: item.title,
        summary: item.description,
        facts: [
          { label: 'Service', value: item.serviceType },
          ...(item.outOfHours
            ? [{ label: 'Availability', value: 'Out-of-hours support' }]
            : []),
          ...item.details.map(({ label, value }) => ({ label, value })),
          ...item.collectionDates.map(({ date, stream }) => ({
            label: stream === 'recycling' ? 'Recycling' : 'Waste & compost',
            value: readableDate(date),
          })),
        ],
        paragraphs: [],
        sourceName: item.sourceName,
        sourceUrl: item.sourceUrl,
        reviewedOn: readableDate(item.sourceReviewedOn),
        contact: {
          ...(item.phone ? { phone: item.phone } : {}),
          ...(item.email ? { email: item.email } : {}),
          ...(item.url ? { url: item.url } : {}),
        },
      }
    : undefined;
}
