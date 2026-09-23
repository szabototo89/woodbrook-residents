import { CalendarDays, Clock3, Coins, Flower2, Mail } from 'lucide-react';
import { studioInteriorImage } from '../../imageAssets';

import {
  formatBookingDate,
  type BookingService,
  type TimeSlot,
} from './booking';
import styles from './jr-booking-journey.module.css';

type BookingSummaryProps = Readonly<{
  service: BookingService | undefined;
  date: string | undefined;
  slot: TimeSlot | undefined;
}>;

export function BookingSummary(props: BookingSummaryProps) {
  return (
    <aside className={styles.sidebar} aria-label="Your booking summary">
      <section className={styles.summaryCard}>
        <h2>Your booking</h2>
        <p>Here&rsquo;s a summary of your appointment request.</p>

        <dl className={styles.summaryList}>
          <div>
            <Flower2 aria-hidden="true" strokeWidth={1.5} />
            <dt>Treatment</dt>
            <dd>{props.service?.name ?? 'Choose a treatment'}</dd>
          </div>
          <div>
            <Clock3 aria-hidden="true" strokeWidth={1.5} />
            <dt>Duration</dt>
            <dd>
              {props.service
                ? `${props.service.durationMinutes} minutes`
                : 'Not selected'}
            </dd>
          </div>
          <div>
            <Coins aria-hidden="true" strokeWidth={1.5} />
            <dt>Price</dt>
            <dd>
              {props.service
                ? `€${props.service.priceCents / 100}`
                : 'Not selected'}
            </dd>
          </div>
          <div>
            <CalendarDays aria-hidden="true" strokeWidth={1.5} />
            <dt>Date</dt>
            <dd>
              {props.date ? formatBookingDate(props.date) : 'Choose a date'}
            </dd>
          </div>
          <div>
            <Clock3 aria-hidden="true" strokeWidth={1.5} />
            <dt>Time</dt>
            <dd>{props.slot?.label ?? 'Choose a time'}</dd>
          </div>
        </dl>

        <div className={styles.nextStep}>
          <Mail aria-hidden="true" strokeWidth={1.5} />
          <div>
            <h3>What happens next?</h3>
            <p>
              This is a request, not a confirmed booking. We&rsquo;ll be in
              touch shortly to confirm your appointment.
            </p>
          </div>
        </div>
      </section>

      <figure className={styles.editorialCard}>
        <img src={studioInteriorImage} alt="" width="800" height="533" />
        <figcaption>
          <span className={styles.editorialLead}>
            <span>More than a</span> <span>treatment</span>
          </span>
          <span className={styles.editorialDetail}>
            <span>&mdash; a little time</span> <span>for you.</span>
          </span>
        </figcaption>
      </figure>
    </aside>
  );
}
