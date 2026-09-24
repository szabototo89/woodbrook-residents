import { CategoryGrid } from '../jr-category-grid/CategoryGrid';
import { LiveFeaturedGrid } from '../jr-featured-grid/LiveFeaturedGrid';
import { Hero } from '../jr-hero/Hero';
import { StudioSections } from '../jr-studio-sections/StudioSections';
import {
  HOME_CONTENT_DEFAULTS,
  mergeText,
  type HomeContent,
} from '../../homeContent/homeContent';
import { CATEGORY_CARDS } from '../../treatments/treatments';
import type { ServicesViewMode } from '../../treatments/useServices';

export type HomePageProps = Readonly<{
  viewMode?: ServicesViewMode;
  bookingBaseUrl?: string;
  treatmentsUrl?: string;
  giftCardUrl?: string;
  featuredSlugs?: string;
  phoneHref?: string;
  emailHref?: string;
  studioImageUrl?: string;
  heroImageUrl?: string;
  homeContent?: HomeContent | null;
  fetchHomeContent?: () => Promise<HomeContent>;
}>;

function pick(
  explicit: string | undefined,
  cmsValue: string | null | undefined,
  fallback: string,
): string {
  return mergeText(explicit, cmsValue, fallback);
}

export function HomePage(props: HomePageProps) {
  const content = props.homeContent ?? null;
  return (
    <main>
      <Hero
        bookingUrl={props.bookingBaseUrl}
        treatmentsUrl={props.treatmentsUrl}
        imageUrl={props.heroImageUrl}
        eyebrow={pick(
          undefined,
          content?.heroEyebrow,
          HOME_CONTENT_DEFAULTS.heroEyebrow,
        )}
        title={pick(
          undefined,
          content?.heroTitle,
          HOME_CONTENT_DEFAULTS.heroTitle,
        )}
        location={pick(
          undefined,
          content?.heroLocation,
          HOME_CONTENT_DEFAULTS.heroLocation,
        )}
        copy={pick(
          undefined,
          content?.heroCopy,
          HOME_CONTENT_DEFAULTS.heroCopy,
        )}
        copySecondLine={pick(
          undefined,
          content?.heroCopySecondLine,
          HOME_CONTENT_DEFAULTS.heroCopySecondLine,
        )}
      />
      <CategoryGrid
        cards={CATEGORY_CARDS}
        viewAllHref={props.treatmentsUrl}
        eyebrow={pick(
          undefined,
          content?.categoriesEyebrow,
          HOME_CONTENT_DEFAULTS.categoriesEyebrow,
        )}
        title={pick(
          undefined,
          content?.categoriesTitle,
          HOME_CONTENT_DEFAULTS.categoriesTitle,
        )}
        viewAllLabel={pick(
          undefined,
          content?.categoriesViewAllLabel,
          HOME_CONTENT_DEFAULTS.categoriesViewAllLabel,
        )}
      />
      <LiveFeaturedGrid
        viewMode={props.viewMode}
        featuredSlugs={props.featuredSlugs}
        bookingBaseUrl={props.bookingBaseUrl}
        viewAllHref={props.treatmentsUrl}
        eyebrow={pick(
          undefined,
          content?.featuredEyebrow,
          HOME_CONTENT_DEFAULTS.featuredEyebrow,
        )}
        title={pick(
          undefined,
          content?.featuredTitle,
          HOME_CONTENT_DEFAULTS.featuredTitle,
        )}
        viewAllLabel={pick(
          undefined,
          content?.featuredViewAllLabel,
          HOME_CONTENT_DEFAULTS.featuredViewAllLabel,
        )}
        fetchHomeContent={props.fetchHomeContent}
      />
      <StudioSections
        giftCardUrl={props.giftCardUrl}
        phoneHref={props.phoneHref}
        emailHref={props.emailHref}
        studioImageUrl={props.studioImageUrl}
        homeContent={content}
      />
    </main>
  );
}
