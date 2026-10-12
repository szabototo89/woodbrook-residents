import { Link } from '@tanstack/react-router';
import {
  CalendarDays,
  FileText,
  House,
  MapPin,
  MoreHorizontal,
} from 'lucide-react';

const destinations = [
  { to: '/', label: 'Home', icon: House },
  { to: '/updates', label: 'Updates', icon: FileText },
  { to: '/events', label: 'Events', icon: CalendarDays },
  { to: '/local-info', label: 'Services', icon: MapPin },
] as const;

export function AppBottomNavigation() {
  return (
    <nav className="search-bottom-nav" aria-label="Quick navigation">
      {destinations.map(({ to, label, icon: Icon }) => (
        <Link key={to} to={to}>
          <Icon size={23} aria-hidden="true" />
          <span>{label}</span>
        </Link>
      ))}
      <details className="search-more">
        <summary>
          <MoreHorizontal size={23} aria-hidden="true" />
          <span>More</span>
        </summary>
        <nav aria-label="More destinations">
          <Link to="/projects">Projects</Link>
          <Link to="/surveys">Consultations</Link>
          <Link to="/get-involved">Get involved</Link>
        </nav>
      </details>
    </nav>
  );
}
