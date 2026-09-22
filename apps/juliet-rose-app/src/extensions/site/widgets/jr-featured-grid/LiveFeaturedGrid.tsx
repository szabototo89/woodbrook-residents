import styles from './featured-grid.module.css';
import { FeaturedGrid } from './FeaturedGrid';
import {
  parseFeaturedSlugs,
  PREVIEW_TREATMENTS,
  resolveFeatured,
  toCardTreatment,
  type BookingsServiceSummary,
  type Treatment,
} from '../../treatments/treatments';
import {
  useServices,
  type ServicesViewMode,
} from '../../treatments/useServices';

type LiveFeaturedGridProps = Readonly<{
  viewMode?: ServicesViewMode;
  featuredSlugs?: string;
  bookingBaseUrl?: string;
  viewAllLabel?: string;
  viewAllHref?: string;
  listServices?: () => Promise<readonly BookingsServiceSummary[]>;
}>;

export function LiveFeaturedGrid(props: LiveFeaturedGridProps) {
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
  const featured = resolveFeatured(
    treatments,
    parseFeaturedSlugs(props.featuredSlugs),
  );
  return (
    <div className={styles.root}>
      <FeaturedGrid
        featured={featured}
        bookingBaseUrl={props.bookingBaseUrl}
        viewAllLabel={props.viewAllLabel}
        viewAllHref={props.viewAllHref}
      />
    </div>
  );
}
