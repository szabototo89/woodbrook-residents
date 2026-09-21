import { Flower2, Heart, Leaf } from 'lucide-react';

import styles from './jr-booking-journey.module.css';

const REASSURANCE_ITEMS = [
  { Icon: Leaf, label: 'Professional & friendly care' },
  { Icon: Heart, label: 'Relaxing environment' },
  { Icon: Flower2, label: 'Tailored to your needs' },
] as const;

export function JrBookingReassurance() {
  return (
    <aside className={styles.reassurance} aria-label="What to expect">
      <ul>
        {REASSURANCE_ITEMS.map(({ Icon, label }) => (
          <li key={label}>
            <Icon aria-hidden="true" strokeWidth={1.5} />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
