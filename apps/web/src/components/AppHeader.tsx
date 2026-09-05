import { Link } from '@tanstack/react-router';
import { Menu, Send } from 'lucide-react';

const navigation = [
  { to: '/updates', label: 'Updates' },
  { to: '/projects', label: 'Projects' },
  { to: '/events', label: 'Events' },
  { to: '/surveys', label: 'Have your say' },
  { to: '/local-info', label: 'Local info' },
] as const;

export function AppHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link
          className="brand"
          to="/"
          aria-label="Woodbrook Community Hub home"
        >
          <span className="brand-mark" aria-hidden="true">
            W
          </span>
          <span className="brand-copy">
            <strong>Woodbrook</strong>
            <span>Community Hub</span>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ 'aria-current': 'page' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className="button button-small header-action" to="/report">
          <Send size={15} aria-hidden="true" />
          Report an issue
        </Link>

        <details className="mobile-nav">
          <summary aria-label="Open navigation">
            <Menu size={22} aria-hidden="true" />
          </summary>
          <nav aria-label="Mobile navigation">
            {navigation.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
            <Link to="/report">Report an issue</Link>
            <Link to="/get-involved">Get involved</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
