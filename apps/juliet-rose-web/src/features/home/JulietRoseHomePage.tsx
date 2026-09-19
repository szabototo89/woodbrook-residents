import { BOOKING_URL } from './content';
import { HeroSection } from './HeroSection';
import { StudioSections } from './StudioSections';
import { TreatmentSections } from './TreatmentSections';

export function JulietRoseHomePage() {
  return (
    <>
      <main id="main-content">
        <HeroSection />
        <TreatmentSections />
        <StudioSections />
      </main>
      <a className="mobile-booking is-visible" href={BOOKING_URL}>
        Book an appointment <span className="icon-arrow" aria-hidden="true" />
      </a>
    </>
  );
}
