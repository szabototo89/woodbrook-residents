import styles from './featured-grid.module.css';
import { FeaturedGrid } from './FeaturedGrid';
import {
  HOME_CONTENT_DEFAULTS,
  mergeText,
  type HomeContent,
} from '../../homeContent/homeContent';
import { useHomeContent } from '../../homeContent/useHomeContent';
import {
  parseFeaturedSlugs,
  PREVIEW_TREATMENTS,
  resolveAutomaticFeatured,
  resolveFeatured,
  toCardTreatment,
  type BookingsServiceSummary,
  type Treatment,
} from '../../treatments/treatments';
import {
  useServices,
  type ServicesViewMode,
} from '../../treatments/useServices';

export type LiveFeaturedGridProps = Readonly<{
  viewMode?: ServicesViewMode;
  featuredSlugs?: string;
  bookingBaseUrl?: string;
  eyebrow?: string;
  title?: string;
  viewAllLabel?: string;
  viewAllHref?: string;
  listServices?: () => Promise<readonly BookingsServiceSummary[]>;
  fetchHomeContent?: () => Promise<HomeContent>;
}>;

export function LiveFeaturedGrid(props: LiveFeaturedGridProps) {
  const summaries = useServices(props.viewMode, props.listServices);
  const homeContent = useHomeContent(props.viewMode, props.fetchHomeContent);
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
  const featured = props.featuredSlugs?.trim()
    ? resolveFeatured(treatments, parseFeaturedSlugs(props.featuredSlugs))
    : resolveAutomaticFeatured(treatments);
  return (
    <div className={styles.root}>
      <FeaturedGrid
        featured={featured}
        bookingBaseUrl={props.bookingBaseUrl}
        eyebrow={mergeText(
          props.eyebrow,
          homeContent?.featuredEyebrow,
          HOME_CONTENT_DEFAULTS.featuredEyebrow,
        )}
        title={mergeText(
          props.title,
          homeContent?.featuredTitle,
          HOME_CONTENT_DEFAULTS.featuredTitle,
        )}
        viewAllLabel={mergeText(
          props.viewAllLabel,
          homeContent?.featuredViewAllLabel,
          HOME_CONTENT_DEFAULTS.featuredViewAllLabel,
        )}
        viewAllHref={props.viewAllHref}
      />
    </div>
  );
}
