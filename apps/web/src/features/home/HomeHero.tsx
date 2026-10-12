import { Link } from '@tanstack/react-router';
import {
  CalendarDays,
  ChevronRight,
  FileText,
  Hammer,
  MapPin,
  Users,
} from 'lucide-react';
import { SiteSearch } from '../../components/SiteSearch';

const shortcuts = [
  { href: '/updates', label: 'Latest updates', icon: FileText },
  { href: '/events', label: 'Upcoming events', icon: CalendarDays },
  {
    href: '/local-info?category=trades',
    label: 'Trades & services',
    icon: Hammer,
  },
  { href: '/local-info', label: 'Local services', icon: MapPin },
] as const;

export function HomeHero() {
  return (
    <section className="coastal-hero" aria-labelledby="home-title">
      <picture className="coastal-hero-image">
        <source
          type="image/webp"
          srcSet="/images/woodbrook-coast-aerial-480.webp 480w, /images/woodbrook-coast-aerial-768.webp 768w, /images/woodbrook-coast-aerial-1200.webp 1200w, /images/woodbrook-coast-aerial-1920.webp 1920w"
          sizes="100vw"
        />
        <img
          src="/images/woodbrook-coast-aerial-1200.jpg"
          alt="Aerial view across Woodbrook toward the coast, Bray and the Wicklow Mountains"
          width="1920"
          height="1420"
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <div className="shell coastal-hero-content">
        <div className="coastal-hero-copy">
          <p className="location-pill">Shankill, Dublin</p>
          <h1 id="home-title">
            Find what’s <br className="mobile-hero-break" />
            happening in <br className="mobile-hero-break" />
            Woodbrook, <span>fast.</span>
          </h1>
          <p className="coastal-hero-lede">
            Local updates, events, projects and practical information for
            Woodbrook and nearby Shankill.
          </p>
          <SiteSearch />
        </div>
        <img
          className="coast-note"
          src="/images/coast-note.png"
          alt=""
          width="1536"
          height="1024"
        />
        <nav className="home-shortcuts" aria-label="Explore Woodbrook">
          {shortcuts.map((item) => (
            <a key={item.href} href={item.href}>
              <item.icon size={25} aria-hidden="true" />
              <span>{item.label}</span>
              <ChevronRight
                size={19}
                className="shortcut-chevron"
                aria-hidden="true"
              />
            </a>
          ))}
          <Link to="/surveys" className="consultation-shortcut">
            <Users size={25} aria-hidden="true" />
            <span>Have your say</span>
          </Link>
        </nav>
        <a
          className="coastal-image-credit"
          href="https://www.woodbrookshankill.ie/south-coast"
          target="_blank"
          rel="noreferrer"
        >
          <MapPin size={15} aria-hidden="true" />
          Woodbrook Shankill<span> · Image source</span>
        </a>
      </div>
    </section>
  );
}
