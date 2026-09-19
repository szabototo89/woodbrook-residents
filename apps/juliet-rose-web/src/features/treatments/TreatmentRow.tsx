import type { Treatment } from './treatmentCatalog';
import { formatTreatmentDuration } from './treatmentCatalog';

export function TreatmentRow({ treatment }: { treatment: Treatment }) {
  return (
    <li className="catalog-treatment">
      <div>
        <h3>{treatment.name}</h3>
        <p>{formatTreatmentDuration(treatment.durationMinutes)}</p>
      </div>
      <div className="catalog-treatment-action">
        <strong>€{treatment.priceCents / 100}</strong>
        <a href={`/book?service=${treatment.slug}`}>Book</a>
      </div>
    </li>
  );
}
