import { CalendarDays, CircleCheck, Sparkles } from 'lucide-react';

const HERO_HIGHLIGHTS = [
  { title: 'Professional & friendly care', Icon: Sparkles },
  { title: 'Relaxing environment', Icon: CalendarDays },
  { title: 'Tailored to your needs', Icon: CircleCheck },
] as const;

export function JrBookingHero() {
  return (
    <section className="editorial-page-hero">
      <div className="editorial-page-hero-content">
        <header className="editorial-page-hero-heading">
          <p className="eyebrow">Book your visit</p>
          <h1>
            <span className="booking-hero-title-line">Request an</span>{' '}
            <span className="booking-hero-title-line">appointment</span>
          </h1>
          <p>
            Choose your treatment, preferred weekday and time. Your appointment
            is confirmed when Juliet Rose gets back to you.
          </p>
        </header>

        <p className="editorial-page-hero-script" aria-hidden="true">
          {['Relax', 'Restore', 'Rejuvenate'].map((line, index) => (
            <span key={line}>
              {index > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </p>

        <ul className="editorial-page-hero-highlights">
          {HERO_HIGHLIGHTS.map(({ title, Icon }) => (
            <li key={title}>
              <Icon aria-hidden="true" strokeWidth={1.5} />
              <span>
                <strong>{title}</strong>
                <small />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
