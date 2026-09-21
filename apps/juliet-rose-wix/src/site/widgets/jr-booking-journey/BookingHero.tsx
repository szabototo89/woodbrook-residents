import { CalendarDays, CircleCheck, Sparkles } from 'lucide-react';

import styles from './jr-booking-journey.module.css';

const HERO_HIGHLIGHTS = [
  { title: 'Professional & friendly care', Icon: Sparkles },
  { title: 'Relaxing environment', Icon: CalendarDays },
  { title: 'Tailored to your needs', Icon: CircleCheck },
] as const;

export function BookingHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <header className={styles.heroHeading}>
          <p className={styles.eyebrow}>Book your visit</p>
          <h1>
            <span className={styles.heroTitleLine}>Request an</span>{' '}
            <span className={styles.heroTitleLine}>appointment</span>
          </h1>
          <p>
            Choose your treatment, preferred weekday and time. Your appointment
            is confirmed when Juliet Rose gets back to you.
          </p>
        </header>

        <p className={styles.heroScript} aria-hidden="true">
          {['Relax', 'Restore', 'Rejuvenate'].map((line, index) => (
            <span key={line}>
              {index > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </p>

        <ul className={styles.heroHighlights}>
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
