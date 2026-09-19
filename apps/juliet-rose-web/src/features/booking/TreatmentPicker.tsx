import type { Treatment } from '../treatments/treatmentCatalog';

type TreatmentPickerProps = {
  treatments: Treatment[];
  value: string;
  onChange: (treatmentSlug: string) => void;
};

export function TreatmentPicker({
  treatments,
  value,
  onChange,
}: TreatmentPickerProps) {
  return (
    <label className="booking-select">
      Treatment
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Choose a treatment</option>
        {treatments.map((treatment) => (
          <option value={treatment.slug} key={treatment.slug}>
            {treatment.name} — €{treatment.priceCents / 100}
          </option>
        ))}
      </select>
    </label>
  );
}
