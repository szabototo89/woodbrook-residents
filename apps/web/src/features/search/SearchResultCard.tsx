import { EventCard } from '../../components/EventCard';
import { ProjectCard } from '../../components/ProjectCard';
import { SurveyCard } from '../../components/SurveyCard';
import { UpdateCard } from '../../components/UpdateCard';
import { LocalServiceCard } from '../resources/LocalServiceCard';
import type { SearchResult } from './searchModel';

type SearchResultCardProps = { result: SearchResult };

export function SearchResultCard(props: SearchResultCardProps) {
  switch (props.result.kind) {
    case 'update':
      return <UpdateCard update={props.result.record} />;
    case 'survey':
      return <SurveyCard survey={props.result.record} />;
    case 'project':
      return <ProjectCard project={props.result.record} />;
    case 'event':
      return <EventCard event={props.result.record} />;
    case 'service':
      return <LocalServiceCard resource={props.result.record} />;
  }
}
