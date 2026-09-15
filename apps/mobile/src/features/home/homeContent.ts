import type { Route } from '../content/contentModels.js';
import type {
  CommunityEvent,
  ContentSnapshot,
  Survey,
  Update,
} from '../content/contentTypes.js';

export function latestUpdate(content: ContentSnapshot): Update | undefined {
  return content.updates[0];
}

export function upcomingEvent(
  content: ContentSnapshot,
): CommunityEvent | undefined {
  return content.events[0];
}

export function openConsultation(content: ContentSnapshot): Survey | undefined {
  return content.surveys.find((survey) => survey.stage !== 'Closed');
}

export type BrowseTarget = Readonly<{
  title: string;
  description: string;
  route: Route;
}>;

export const browseTargets: readonly BrowseTarget[] = [
  {
    title: 'Updates',
    description: 'Source-linked local changes and next steps.',
    route: { name: 'collection', collection: 'updates' },
  },
  {
    title: 'Projects',
    description: 'What is proposed, active, completed, or monitored.',
    route: { name: 'collection', collection: 'projects' },
  },
  {
    title: 'Events',
    description: 'Confirmed local dates and ways to take part.',
    route: { name: 'collection', collection: 'events' },
  },
  {
    title: 'Consultations',
    description: 'Open chances to respond, plus closed records.',
    route: { name: 'collection', collection: 'surveys' },
  },
  {
    title: 'Local information',
    description: 'Nearby services, contacts, and everyday essentials.',
    route: { name: 'collection', collection: 'resources' },
  },
];
