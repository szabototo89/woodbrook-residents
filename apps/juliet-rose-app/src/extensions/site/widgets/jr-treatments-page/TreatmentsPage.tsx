import { LiveTreatmentCatalog } from '../jr-treatment-catalog/LiveTreatmentCatalog';
import { TreatmentGuidance } from '../jr-treatment-guidance/TreatmentGuidance';
import { TreatmentHero } from '../jr-treatment-hero/TreatmentHero';
import type { ServicesViewMode } from '../../treatments/useServices';

export type TreatmentsPageProps = Readonly<{
  viewMode?: ServicesViewMode;
  bookingBaseUrl?: string;
  contactUrl?: string;
  heroEyebrow?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImageUrl?: string;
}>;

export function TreatmentsPage(props: TreatmentsPageProps) {
  return (
    <main>
      <TreatmentHero
        eyebrow={props.heroEyebrow}
        title={props.heroTitle}
        description={props.heroDescription}
        imageUrl={props.heroImageUrl}
      />
      <LiveTreatmentCatalog
        viewMode={props.viewMode}
        bookingBaseUrl={props.bookingBaseUrl}
      />
      <TreatmentGuidance contactUrl={props.contactUrl} />
    </main>
  );
}
