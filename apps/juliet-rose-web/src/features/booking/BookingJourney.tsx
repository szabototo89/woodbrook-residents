import { format } from 'date-fns';
import { useState } from 'react';

import {
  getTreatmentBySlug,
  listTreatments,
} from '../treatments/treatmentCatalog';
import { AppointmentDatePicker } from './AppointmentDatePicker';
import { formatBookingDate } from './availability';
import { BookingHero } from './BookingHero';
import type { BookingConfirmation, BookingProvider } from './bookingProvider';
import { BookingReassurance } from './BookingReassurance';
import {
  CustomerDetailsForm,
  type CustomerDetails,
} from './CustomerDetailsForm';
import { TimeSlotPicker } from './TimeSlotPicker';
import { TreatmentPicker } from './TreatmentPicker';

type BookingJourneyProps = {
  initialTreatmentSlug?: string;
  provider: BookingProvider;
  today?: Date;
};

export function BookingJourney(props: BookingJourneyProps) {
  const initialTreatment = props.initialTreatmentSlug
    ? getTreatmentBySlug(props.initialTreatmentSlug)
    : undefined;
  const [treatmentSlug, setTreatmentSlug] = useState(
    initialTreatment?.slug ?? '',
  );
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [times, setTimes] = useState<string[]>([]);
  const [confirmation, setConfirmation] = useState<BookingConfirmation>();
  const treatment = getTreatmentBySlug(treatmentSlug);

  function selectTreatment(nextSlug: string) {
    setTreatmentSlug(nextSlug);
    setDate(undefined);
    setTime('');
    setTimes([]);
  }

  function selectDate(nextDate: Date | undefined) {
    setDate(nextDate);
    setTime('');
    setTimes([]);
    if (!nextDate || !treatmentSlug) return;
    void props.provider
      .listAvailableTimes({
        treatmentSlug,
        date: format(nextDate, 'yyyy-MM-dd'),
      })
      .then(setTimes);
  }

  async function submit(details: CustomerDetails) {
    if (!date || !time || !treatmentSlug) return;
    const result = await props.provider.createBooking({
      treatmentSlug,
      date: format(date, 'yyyy-MM-dd'),
      time,
      customer: details,
      notes: details.notes || undefined,
    });
    setConfirmation(result);
  }

  if (confirmation && treatment && date) {
    return (
      <section className="booking-confirmation" role="status">
        <p className="eyebrow">Request received</p>
        <h1>Thank you</h1>
        <p>
          Your request for <strong>{treatment.name}</strong> on{' '}
          <strong>{formatBookingDate(date)}</strong> at <strong>{time}</strong>{' '}
          has been sent. Juliet Rose will confirm your appointment using the
          contact details provided.
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
      <BookingHero />

      <div className="booking-flow page-width">
        <section className="booking-step" aria-labelledby="treatment-step">
          <span className="step-number">1</span>
          <div>
            <h2 id="treatment-step">Choose a treatment</h2>
            <TreatmentPicker
              treatments={listTreatments()}
              value={treatmentSlug}
              onChange={selectTreatment}
            />
            {treatment ? (
              <p className="selected-treatment">
                {treatment.durationMinutes} minutes · €
                {treatment.priceCents / 100}
              </p>
            ) : null}
          </div>
        </section>

        <section className="booking-step" aria-labelledby="date-step">
          <span className="step-number">2</span>
          <div>
            <h2 id="date-step">Choose a date</h2>
            <p className="booking-hint">Appointments are Monday to Friday.</p>
            <AppointmentDatePicker
              selected={date}
              onSelect={selectDate}
              today={props.today}
            />
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
            <TimeSlotPicker times={times} value={time} onChange={setTime} />
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
            <CustomerDetailsForm
              disabled={!treatmentSlug || !date || !time}
              onSubmit={submit}
            />
          </div>
        </section>
      </div>

      <BookingReassurance />
    </div>
  );
}
