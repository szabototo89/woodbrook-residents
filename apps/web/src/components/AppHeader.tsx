import { Link, useRouterState } from '@tanstack/react-router';
import { ArrowRight, Menu, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { SiteSearch } from './SiteSearch';

const navigation = [
  { to: '/updates', label: 'Updates' },
  { to: '/events', label: 'Events' },
  { to: '/projects', label: 'Projects' },
  { to: '/surveys', label: 'Consultations' },
  { to: '/local-info', label: 'Local information' },
  { to: '/search', label: 'Search' },
] as const;

export function AppHeader() {
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
  const mobileNavigationRef = useRef<HTMLDivElement>(null);
  const mobileNavigationButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  useEffect(() => {
    setIsMobileNavigationOpen(false);
  }, [pathname]);

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
          <span className="brand-image-frame">
            <img
              src="/images/woodbrook-wordmark.png"
              alt="Woodbrook Residents"
              width="2048"
              height="683"
            />
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ 'aria-current': 'page' }}
            >
              {item.to === '/search' ? (
                <Search size={19} aria-label="Search" />
              ) : (
                item.label
              )}
            </Link>
          ))}
        </nav>

        <SiteSearch compact />

        <Link className="button button-small header-action" to="/get-involved">
          Get involved <ArrowRight size={15} aria-hidden="true" />
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
