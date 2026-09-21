import { useEffect, useState } from 'react';

import { queryBookingServices } from './bookingsServices';
import styles from './jr-treatment-cards.module.css';
import { CategoryGrid } from './CategoryGrid';
import { FeaturedGrid } from './FeaturedGrid';
import { TreatmentCatalog } from './TreatmentCatalog';
import { TreatmentGuidance } from './TreatmentGuidance';
import {
  CATEGORY_CARDS,
  PREVIEW_TREATMENTS,
  parseFeaturedSlugs,
  resolveFeatured,
  toCardTreatment,
  type BookingsServiceSummary,
  type Treatment,
} from './treatments';

export type TreatmentCardsViewMode = 'Editor' | 'Preview' | 'Site';

export type TreatmentCardsDisplay = 'catalog' | 'home' | 'all';

type TreatmentCardsProps = Readonly<{
  viewMode?: TreatmentCardsViewMode;
  display?: TreatmentCardsDisplay;
  featuredSlugs?: string;
  listServices?: () => Promise<readonly BookingsServiceSummary[]>;
}>;

type CardsState =
  | Readonly<{ status: 'preview'; treatments: readonly Treatment[] }>
  | Readonly<{ status: 'loading' }>
  | Readonly<{ status: 'ready'; treatments: readonly Treatment[] }>
  | Readonly<{ status: 'failed' }>;

export function TreatmentCards(props: TreatmentCardsProps) {
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
        {props.display === 'home' ? null : <TreatmentGuidance />}
      </div>
    );
  }

  if (state.status === 'failed') {
    return (
      <div className={styles.root}>
        <p role="alert">Treatments are unavailable right now.</p>
        {props.display === 'home' ? null : <TreatmentGuidance />}
      </div>
    );
  }

  const featured = resolveFeatured(
    state.treatments,
    parseFeaturedSlugs(props.featuredSlugs),
  );
  return (
    <div className={styles.root}>
      {props.display === 'catalog' ? null : (
        <>
          <CategoryGrid cards={CATEGORY_CARDS} />
          <FeaturedGrid featured={featured} />
        </>
      )}
      {props.display === 'home' ? null : (
        <>
          <TreatmentCatalog treatments={state.treatments} />
          <TreatmentGuidance />
        </>
      )}
    </div>
  );
}
