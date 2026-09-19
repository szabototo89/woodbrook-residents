import type { Treatment } from '../treatments/treatmentCatalog';

type TreatmentPickerProps = {
  treatments: Treatment[];
  value: string;
  onChange: (treatmentSlug: string) => void;
};

export function TreatmentPicker(props: TreatmentPickerProps) {
  return (
    <label className="booking-select">
      <span className="visually-hidden">Treatment</span>
      <select
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
      >
        <option value="">Choose a treatment</option>
        {props.treatments.map((treatment) => (
          <option value={treatment.slug} key={treatment.slug}>
            {treatment.name} — €{treatment.priceCents / 100}
          </option>
        ))}
      </select>
    </label>
  );
}
