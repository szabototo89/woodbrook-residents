import { CalendarDays } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  MOCK_SERVICES,
  MOCK_SLOTS,
  formatBookingDate,
  isBookableDateString,
  mockConfirmation,
  toDateString,
  type BookingConfirmation,
  type BookingService,
  type CustomerDetails,
  type TimeSlot,
} from './booking';
import {
  queryBookingOptions,
  queryDaySlots,
  submitBookingRequest,
} from './bookingGateway';
import { JrBookingDateInput } from './JrBookingDateInput';
import { JrBookingHero } from './JrBookingHero';
import { JrBookingReassurance } from './JrBookingReassurance';
import { JrBookingSummary } from './JrBookingSummary';
import { JrBookingTimeSlots } from './JrBookingTimeSlots';
import { JrCustomerForm } from './JrCustomerForm';
import { JrTreatmentPicker } from './JrTreatmentPicker';

export type BookingJourneyViewMode = 'Editor' | 'Preview' | 'Site';

type JrBookingJourneyProps = Readonly<{
  viewMode?: BookingJourneyViewMode;
  initialService?: string;
  today?: string;
  listServices?: () => Promise<readonly BookingService[]>;
  listSlots?: (serviceId: string, date: string) => Promise<readonly TimeSlot[]>;
  submitBooking?: (request: {
    service: BookingService;
    date: string;
    slot: TimeSlot;
    customer: CustomerDetails;
  }) => Promise<BookingConfirmation>;
}>;

function maxDateString(today: string): string {
  const [year, month, day] = today.split('-').map(Number);
  return toDateString(new Date(year ?? 0, (month ?? 1) - 1 + 6, day ?? 1));
}

export function JrBookingJourney(props: JrBookingJourneyProps) {
  const today = props.today ?? toDateString(new Date());
  const isLive = props.viewMode === 'Preview' || props.viewMode === 'Site';
  const [services, setServices] = useState<
    readonly BookingService[] | undefined
  >(() => (isLive ? undefined : MOCK_SERVICES));
  const [serviceSlug, setServiceSlug] = useState(props.initialService ?? '');
  const [date, setDate] = useState<string>();
  const [slots, setSlots] = useState<readonly TimeSlot[]>([]);
  const [slotStart, setSlotStart] = useState('');
  const [confirmation, setConfirmation] = useState<BookingConfirmation>();

  useEffect(() => {
    if (!isLive) {
      return;
    }
    const listServices = props.listServices ?? queryBookingOptions;
    async function loadServices() {
      try {
        setServices(await listServices());
      } catch {
        setServices([]);
      }
    }
    void loadServices();
  }, [isLive, props.listServices]);

  const service = services?.find((item) => item.slug === serviceSlug);
  const slot = slots.find((item) => item.start === slotStart);

  function selectService(nextSlug: string) {
    setServiceSlug(nextSlug);
    setDate(undefined);
    setSlotStart('');
    setSlots([]);
  }

  function selectDate(nextDate: string | undefined) {
    setDate(nextDate);
    setSlotStart('');
    setSlots([]);
    if (!nextDate || !service || !isBookableDateString(nextDate, today)) {
      return;
    }
    const listSlots =
      props.listSlots ??
      (isLive
        ? queryDaySlots
        : async (_serviceId: string, day: string) => MOCK_SLOTS(day));
    async function loadSlots() {
      setSlots(await listSlots(service?.id ?? '', nextDate ?? ''));
    }
    void loadSlots();
  }

  async function submit(details: CustomerDetails) {
    if (!service || !date || !slot) {
      return;
    }
    const submitBooking =
      props.submitBooking ??
      (isLive ? submitBookingRequest : async () => mockConfirmation());
    setConfirmation(
      await submitBooking({ service, date, slot, customer: details }),
    );
  }

  if (confirmation && service && date && slot) {
    return (
      <section className="booking-confirmation" role="status">
        <p className="eyebrow">Request received</p>
        <h1>Thank you</h1>
        <p>
          Your request for <strong>{service.name}</strong> on{' '}
          <strong>{formatBookingDate(date)}</strong> at{' '}
          <strong>{slot.label}</strong> has been sent. Juliet Rose will confirm
          your appointment using the contact details provided.
        </p>
        <p className="booking-reference">
          Request reference: {confirmation.reference}
        </p>
        <a className="secondary-button" href="/treatments">
          Back to treatments
        </a>
      </section>
    );
  }

  return (
    <div className="booking-journey">
      <JrBookingHero />

      <div className="booking-workspace page-width">
        <div className="booking-flow">
          <section className="booking-step" aria-labelledby="treatment-step">
            <span className="step-number">1</span>
            <div>
              <h2 id="treatment-step">Choose a treatment</h2>
              <p className="booking-hint">
                Select the treatment you&rsquo;d like to book.
              </p>
              <div className="booking-treatment-layout">
                <div>
                  <span className="booking-field-label">Treatment</span>
                  <JrTreatmentPicker
                    services={services ?? []}
                    value={serviceSlug}
                    onChange={selectService}
                  />
                  {service ? (
                    <p className="selected-treatment">
                      {service.durationMinutes} minutes · €
                      {service.priceCents / 100}
                    </p>
                  ) : null}
                </div>
                <figure className="booking-treatment-editorial">
                  <img
                    src="/images/gift-card.jpg"
                    alt=""
                    width="800"
                    height="347"
                  />
                  <figcaption>
                    &ldquo;Take time for
                    <br />
                    yourself. You deserve it.&rdquo;
                  </figcaption>
                </figure>
              </div>
            </div>
          </section>

          <section className="booking-step" aria-labelledby="date-step">
            <span className="step-number">2</span>
            <div>
              <h2 id="date-step">Choose a date</h2>
              <p className="booking-hint">Appointments are Monday to Friday.</p>
              <div className="booking-calendar-layout">
                <JrBookingDateInput
                  value={date}
                  min={today}
                  max={maxDateString(today)}
                  onSelect={selectDate}
                />
                <aside
                  className="booking-calendar-key"
                  aria-label="Calendar key"
                >
                  <ul>
                    <li className="is-selected">Selected date</li>
                    <li className="is-available">Available date</li>
                    <li className="is-unavailable">Unavailable date</li>
                  </ul>
                  <p>
                    <CalendarDays aria-hidden="true" strokeWidth={1.5} />
                    <span>
                      If you can&rsquo;t find a suitable date, please get in
                      touch and we&rsquo;ll do our best to help.
                    </span>
                  </p>
                </aside>
              </div>
            </div>
          </section>

          <section className="booking-step" aria-labelledby="time-step">
            <span className="step-number">3</span>
            <div>
              <h2 id="time-step">Choose a preferred time</h2>
              {date ? (
                <p className="booking-hint">
                  Available times for {formatBookingDate(date)}.
                </p>
              ) : null}
              <JrBookingTimeSlots
                slots={slots}
                value={slotStart}
                onChange={setSlotStart}
              />
            </div>
          </section>

          <section className="booking-step" aria-labelledby="details-step">
            <span className="step-number">4</span>
            <div>
              <h2 id="details-step">Your details</h2>
              <p className="booking-hint">
                Please provide your contact information so we can confirm your
                appointment.
              </p>
              <JrCustomerForm
                disabled={!service || !date || !slot}
                onSubmit={submit}
              />
            </div>
          </section>
        </div>

        <JrBookingSummary service={service} date={date} slot={slot} />
      </div>

      <JrBookingReassurance />
    </div>
  );
}
