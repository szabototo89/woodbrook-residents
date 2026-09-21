import styles from './treatment-catalog.module.css';
import { TreatmentCatalog } from './TreatmentCatalog';
import {
  PREVIEW_TREATMENTS,
  toCardTreatment,
  type BookingsServiceSummary,
  type Treatment,
} from '../../treatments/treatments';
import {
  useServices,
  type ServicesViewMode,
} from '../../treatments/useServices';

type LiveTreatmentCatalogProps = Readonly<{
  viewMode?: ServicesViewMode;
  bookingBaseUrl?: string;
  listServices?: () => Promise<readonly BookingsServiceSummary[]>;
}>;

export function LiveTreatmentCatalog(props: LiveTreatmentCatalogProps) {
  const summaries = useServices(props.viewMode, props.listServices);
  const isLive = props.viewMode === 'Preview' || props.viewMode === 'Site';

  if (summaries === undefined) {
    return (
      <div className={styles.root}>
        <p role="status">Loading treatments…</p>
      </div>
    );
  }

  const treatments: readonly Treatment[] = isLive
    ? summaries
        .map(toCardTreatment)
        .filter((treatment): treatment is Treatment => treatment !== null)
    : PREVIEW_TREATMENTS;
  return (
    <div className={styles.root}>
      <TreatmentCatalog
        treatments={treatments}
        bookingBaseUrl={props.bookingBaseUrl}
      />
    </div>
  );
}
