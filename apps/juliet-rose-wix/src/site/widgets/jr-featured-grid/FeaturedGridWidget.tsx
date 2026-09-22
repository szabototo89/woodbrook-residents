import {
  LiveFeaturedGrid,
  type LiveFeaturedGridProps,
} from './LiveFeaturedGrid';
import { useWixViewMode } from '../../useWixViewMode';

export function FeaturedGridWidget(props: LiveFeaturedGridProps) {
  const viewMode = useWixViewMode(props.viewMode);
  return <LiveFeaturedGrid {...props} viewMode={viewMode} />;
}
