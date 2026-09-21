import { useEffect, useState } from 'react';

import { BOOKING_URL } from '../features/home/content';

const navigationItems = [
  { label: 'Home', href: '/' },
  { label: 'Treatments', href: '/treatments' },
  { label: 'Gift Cards', href: '/gift-cards' },
  { label: 'Contact', href: '/#contact' },
] as const;

type NavigationHref = (typeof navigationItems)[number]['href'];
type ActiveNavigationItem = Extract<
  NavigationHref,
  '/' | '/treatments' | '/gift-cards'
>;

type SiteHeaderProps = {
  activeNavigationItem?: ActiveNavigationItem;
};

export function toActiveNavigationItem(
  pathname: string,
): ActiveNavigationItem | undefined {
  if (pathname === '/') return '/';
  if (pathname === '/treatments') return '/treatments';
  if (pathname === '/gift-cards') return '/gift-cards';
  return undefined;
}

export function SiteHeader(props: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('menu-open', isMenuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [isMenuOpen]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsMenuOpen(false);
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="/">
          <span>Juliet Rose</span>
          <small>Beauty Studio</small>
        </a>

        <nav className="desktop-navigation" aria-label="Main navigation">
          {navigationItems.map((item) => (
            <a
              aria-current={
                item.href === props.activeNavigationItem ? 'page' : undefined
              }
              className={
                item.href === props.activeNavigationItem
                  ? 'is-current'
                  : undefined
              }
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a className="primary-button header-booking" href={BOOKING_URL}>
          Book an appointment <span className="icon-arrow" aria-hidden="true" />
        </a>

        <button
          className="menu-button"
          type="button"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav
        className="mobile-navigation"
        id="mobile-navigation"
        aria-label="Mobile navigation"
        hidden={!isMenuOpen}
      >
        {navigationItems.map((item) => (
          <a
            aria-current={
              item.href === props.activeNavigationItem ? 'page' : undefined
            }
            className={
              item.href === props.activeNavigationItem
                ? 'is-current'
                : undefined
            }
            href={item.href}
            key={item.href}
            onClick={() => setIsMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
        <a className="primary-button" href={BOOKING_URL}>
          Book an appointment <span className="icon-arrow" aria-hidden="true" />
        </a>
      </nav>
    </header>
  );
}
