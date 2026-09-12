import { Link } from '@tanstack/react-router';
import { Menu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const navigation = [
  { to: '/updates', label: 'Updates' },
  { to: '/events', label: 'Events' },
  { to: '/projects', label: 'Projects' },
  { to: '/surveys', label: 'Consultations' },
  { to: '/local-info', label: 'Local information' },
] as const;

export function AppHeader() {
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
  const mobileNavigationRef = useRef<HTMLDivElement>(null);
  const mobileNavigationButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isMobileNavigationOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !mobileNavigationRef.current?.contains(event.target)
      ) {
        setIsMobileNavigationOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsMobileNavigationOpen(false);
        mobileNavigationButtonRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileNavigationOpen]);

  function closeMobileNavigation() {
    setIsMobileNavigationOpen(false);
  }

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" to="/">
          <span className="brand-mark" aria-hidden="true">
            W
          </span>
          <span className="brand-copy">
            <strong>Woodbrook Residents</strong>
            <span aria-hidden="true">Community hub · Shankill</span>
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

        <Link className="button button-small header-action" to="/get-involved">
          Get involved
        </Link>

        <div className="mobile-nav" ref={mobileNavigationRef}>
          <button
            ref={mobileNavigationButtonRef}
            type="button"
            aria-controls="mobile-navigation-links"
            aria-expanded={isMobileNavigationOpen}
            aria-label={`${isMobileNavigationOpen ? 'Close' : 'Open'} navigation`}
            onClick={() =>
              setIsMobileNavigationOpen((isNavigationOpen) => !isNavigationOpen)
            }
          >
            <Menu size={22} aria-hidden="true" />
          </button>
          <nav
            id="mobile-navigation-links"
            aria-label="Mobile navigation"
            hidden={!isMobileNavigationOpen}
          >
            {navigation.map((item) => (
              <Link key={item.to} to={item.to} onClick={closeMobileNavigation}>
                {item.label}
              </Link>
            ))}
            <Link to="/get-involved" onClick={closeMobileNavigation}>
              Get involved
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
