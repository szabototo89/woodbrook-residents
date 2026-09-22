import {
  LiveTreatmentCatalog,
  type LiveTreatmentCatalogProps,
} from './LiveTreatmentCatalog';
import { useWixViewMode } from '../../useWixViewMode';

export function TreatmentCatalogWidget(props: LiveTreatmentCatalogProps) {
  const viewMode = useWixViewMode(props.viewMode);
  return <LiveTreatmentCatalog {...props} viewMode={viewMode} />;
}
