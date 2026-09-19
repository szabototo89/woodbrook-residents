import type { Treatment } from './treatmentCatalog';
import { formatTreatmentDuration } from './treatmentCatalog';

export function TreatmentRow(props: { treatment: Treatment }) {
  return (
    <li className="catalog-treatment">
      <div>
        <h3>{props.treatment.name}</h3>
        <p>{formatTreatmentDuration(props.treatment.durationMinutes)}</p>
      </div>
      <div className="catalog-treatment-action">
        <strong>€{props.treatment.priceCents / 100}</strong>
        <a
          aria-label={`Book ${props.treatment.name}`}
          href={`/book?service=${props.treatment.slug}`}
        >
          Book
        </a>
      </div>
    </li>
  );
}
