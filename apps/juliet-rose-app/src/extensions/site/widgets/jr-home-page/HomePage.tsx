import { CategoryGrid } from '../jr-category-grid/CategoryGrid';
import { LiveFeaturedGrid } from '../jr-featured-grid/LiveFeaturedGrid';
import { Hero } from '../jr-hero/Hero';
import { StudioSections } from '../jr-studio-sections/StudioSections';
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
}>;

export function HomePage(props: HomePageProps) {
  return (
    <main>
      <Hero
        bookingUrl={props.bookingBaseUrl}
        treatmentsUrl={props.treatmentsUrl}
        imageUrl={props.heroImageUrl}
      />
      <CategoryGrid cards={CATEGORY_CARDS} viewAllHref={props.treatmentsUrl} />
      <LiveFeaturedGrid
        viewMode={props.viewMode}
        featuredSlugs={props.featuredSlugs}
        bookingBaseUrl={props.bookingBaseUrl}
        viewAllHref={props.treatmentsUrl}
      />
      <StudioSections
        giftCardUrl={props.giftCardUrl}
        phoneHref={props.phoneHref}
        emailHref={props.emailHref}
        studioImageUrl={props.studioImageUrl}
      />
    </main>
  );
}
