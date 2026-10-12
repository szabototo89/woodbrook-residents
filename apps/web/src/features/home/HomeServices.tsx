import {
  BusFront,
  ChevronRight,
  CirclePlus,
  GraduationCap,
  Phone,
  Recycle,
  Trash2,
} from 'lucide-react';

const services = [
  {
    href: '/local-info?q=bin+collection',
    label: 'Bin collection dates',
    icon: Trash2,
  },
  {
    href: '/local-info?category=education',
    label: 'Schools & childcare',
    icon: GraduationCap,
  },
  {
    href: '/local-info?category=health',
    label: 'Healthcare & GPs',
    icon: CirclePlus,
  },
  {
    href: '/local-info?category=transport',
    label: 'Transport',
    icon: BusFront,
  },
  {
    href: '/local-info?category=waste',
    label: 'Waste & recycling',
    icon: Recycle,
  },
  { href: '/local-info', label: 'Useful contacts', icon: Phone },
];

export function HomeServices() {
  return (
    <section className="home-services" aria-labelledby="home-services-title">
      <div>
        <h2 id="home-services-title">Need something quickly?</h2>
        <p>Common information and services for Woodbrook residents.</p>
      </div>
      <nav className="home-service-links" aria-label="Everyday services">
        {services.map((service) => (
          <a key={service.label} href={service.href}>
            <service.icon size={29} strokeWidth={1.6} aria-hidden="true" />
            <span>{service.label}</span>
            <ChevronRight size={15} aria-hidden="true" />
          </a>
        ))}
      </nav>
    </section>
  );
}
