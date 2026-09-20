import { CalendarDays, Clock3, Coins, Flower2, Mail } from 'lucide-react';

import type { Treatment } from '../treatments/treatmentCatalog';
import { formatBookingDate } from './availability';

type BookingSidebarProps = {
  treatment: Treatment | undefined;
  date: Date | undefined;
  time: string;
};

export function BookingSidebar(props: BookingSidebarProps) {
  return (
    <aside className="booking-sidebar" aria-label="Your booking summary">
      <section className="booking-summary-card">
        <h2>Your booking</h2>
        <p>Here&rsquo;s a summary of your appointment request.</p>

        <dl className="booking-summary-list">
          <div>
            <Flower2 aria-hidden="true" strokeWidth={1.5} />
            <dt>Treatment</dt>
            <dd>{props.treatment?.name ?? 'Choose a treatment'}</dd>
          </div>
          <div>
            <Clock3 aria-hidden="true" strokeWidth={1.5} />
            <dt>Duration</dt>
            <dd>
              {props.treatment
                ? `${props.treatment.durationMinutes} minutes`
                : 'Not selected'}
            </dd>
          </div>
          <div>
            <Coins aria-hidden="true" strokeWidth={1.5} />
            <dt>Price</dt>
            <dd>
              {props.treatment
                ? `€${props.treatment.priceCents / 100}`
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
            <dd>{props.time || 'Choose a time'}</dd>
          </div>
        </dl>

        <div className="booking-next-step">
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

      <figure className="booking-editorial-card">
        <img
          src="/images/studio-interior.jpg"
          alt=""
          width="800"
          height="533"
        />
        <figcaption>
          <span className="booking-editorial-lead">More than a treatment</span>
          <br />
          <span className="booking-editorial-detail">
            &mdash; a little time
          </span>
          <br />
          for you.
        </figcaption>
      </figure>
    </aside>
  );
}
