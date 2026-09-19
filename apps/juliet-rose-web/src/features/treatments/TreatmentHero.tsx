import { Flower2, Heart, Leaf } from 'lucide-react';

const treatmentPromises = [
  {
    title: 'Relax & unwind',
    description: 'Expert care, tailored to you',
    Icon: Leaf,
  },
  {
    title: 'Natural radiance',
    description: 'Real results, naturally',
    Icon: Flower2,
  },
  {
    title: 'A more confident you',
    description: 'Because you deserve it',
    Icon: Heart,
  },
] as const;

export function TreatmentHero() {
  return (
    <section className="treatment-hero">
      <div className="treatment-hero-content page-width">
        <header className="treatment-hero-heading">
          <p className="eyebrow">Our services</p>
          <h1>Treatments &amp; prices</h1>
          <p>
            Choose a treatment and send an appointment request at a date and
            time that suits you.
          </p>
        </header>

        <p className="treatment-hero-script" aria-hidden="true">
          Relax
          <br />
          and
          <br />
          Rejuvenate
        </p>

        <ul className="treatment-promises">
          {treatmentPromises.map(({ title, description, Icon }) => (
            <li key={title}>
              <Icon aria-hidden="true" strokeWidth={1.5} />
              <span>
                <strong>{title}</strong>
                <small>{description}</small>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
