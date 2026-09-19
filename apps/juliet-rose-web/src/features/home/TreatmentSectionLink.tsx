import { BOOKING_URL } from './content';

export function TreatmentSectionLink() {
  return (
    <a className="section-link" href={BOOKING_URL}>
      View all treatments <span className="icon-arrow" aria-hidden="true" />
    </a>
  );
}
