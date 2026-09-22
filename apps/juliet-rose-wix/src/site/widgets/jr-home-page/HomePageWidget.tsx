import { HomePage, type HomePageProps } from './HomePage';
import { useWixViewMode } from '../../useWixViewMode';

export function HomePageWidget(props: HomePageProps) {
  const viewMode = useWixViewMode(props.viewMode);
  return <HomePage {...props} viewMode={viewMode} />;
}
