import { Flower2, Heart, Leaf } from 'lucide-react';

const reassuranceItems = [
  { Icon: Leaf, label: 'Professional & friendly care' },
  { Icon: Heart, label: 'Relaxing environment' },
  { Icon: Flower2, label: 'Tailored to your needs' },
] as const;

export function BookingReassurance() {
  return (
    <aside className="booking-reassurance" aria-label="What to expect">
      <ul>
        {reassuranceItems.map(({ Icon, label }) => (
          <li key={label}>
            <Icon aria-hidden="true" strokeWidth={1.5} />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
