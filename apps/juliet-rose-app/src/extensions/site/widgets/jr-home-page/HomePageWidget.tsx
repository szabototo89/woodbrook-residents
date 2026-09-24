import { HomePage, type HomePageProps } from './HomePage';
import { useHomeContent } from '../../homeContent/useHomeContent';
import { useWixViewMode } from '../../useWixViewMode';

export function HomePageWidget(props: HomePageProps) {
  const viewMode = useWixViewMode(props.viewMode);
  const homeContent = useHomeContent(viewMode);
  return <HomePage {...props} viewMode={viewMode} homeContent={homeContent} />;
}
