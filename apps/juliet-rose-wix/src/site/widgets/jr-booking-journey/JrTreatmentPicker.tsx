import type { BookingService } from './booking';

type JrTreatmentPickerProps = Readonly<{
  services: readonly BookingService[];
  value: string;
  onChange: (serviceSlug: string) => void;
}>;

export function JrTreatmentPicker(props: JrTreatmentPickerProps) {
  return (
    <label className="booking-select">
      <span className="visually-hidden">Treatment</span>
      <select
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
      >
        <option value="">Choose a treatment</option>
        {props.services.map((service) => (
          <option value={service.slug} key={service.slug}>
            {service.name} — €{service.priceCents / 100}
          </option>
        ))}
      </select>
    </label>
  );
}
