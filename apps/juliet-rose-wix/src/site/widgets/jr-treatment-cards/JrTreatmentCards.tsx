import { useEffect, useState } from 'react';

import { queryBookingServices } from './bookingsServices';
import styles from './jr-treatment-cards.module.css';
import { JrTreatmentCatalog } from './JrTreatmentCatalog';
import { JrTreatmentGuidance } from './JrTreatmentGuidance';
import {
  PREVIEW_TREATMENTS,
  toCardTreatment,
  type BookingsServiceSummary,
  type Treatment,
} from './treatments';

export type TreatmentCardsViewMode = 'Editor' | 'Preview' | 'Site';

type JrTreatmentCardsProps = Readonly<{
  viewMode?: TreatmentCardsViewMode;
  listServices?: () => Promise<readonly BookingsServiceSummary[]>;
}>;

type CardsState =
  | Readonly<{ status: 'preview'; treatments: readonly Treatment[] }>
  | Readonly<{ status: 'loading' }>
  | Readonly<{ status: 'ready'; treatments: readonly Treatment[] }>
  | Readonly<{ status: 'failed' }>;

export function JrTreatmentCards(props: JrTreatmentCardsProps) {
  const [state, setState] = useState<CardsState>(() =>
    props.viewMode === 'Preview' || props.viewMode === 'Site'
      ? { status: 'loading' }
      : { status: 'preview', treatments: PREVIEW_TREATMENTS },
  );

  useEffect(() => {
    if (props.viewMode !== 'Preview' && props.viewMode !== 'Site') {
      return;
    }
    const listServices = props.listServices ?? queryBookingServices;
    async function loadServices() {
      try {
        const services = await listServices();
        const treatments = services
          .map(toCardTreatment)
          .filter((treatment): treatment is Treatment => treatment !== null);
        setState({ status: 'ready', treatments });
      } catch {
        setState({ status: 'failed' });
      }
    }
    void loadServices();
  }, [props.viewMode, props.listServices]);

  if (state.status === 'loading') {
    return (
      <div className={styles.root}>
        <p role="status">Loading treatments…</p>
        <JrTreatmentGuidance />
      </div>
    );
  }

  if (state.status === 'failed') {
    return (
      <div className={styles.root}>
        <p role="alert">Treatments are unavailable right now.</p>
        <JrTreatmentGuidance />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <JrTreatmentCatalog treatments={state.treatments} />
      <JrTreatmentGuidance />
    </div>
  );
}
