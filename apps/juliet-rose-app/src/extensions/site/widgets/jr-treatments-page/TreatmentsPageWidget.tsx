import { TreatmentsPage, type TreatmentsPageProps } from './TreatmentsPage';
import { useWixViewMode } from '../../useWixViewMode';

export function TreatmentsPageWidget(props: TreatmentsPageProps) {
  const viewMode = useWixViewMode(props.viewMode);
  return <TreatmentsPage {...props} viewMode={viewMode} />;
}
