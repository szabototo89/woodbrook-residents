import { useEffect, useState } from 'react';

import styles from './jr-site-header.module.css';

export type SiteHeaderProps = Readonly<{
  activeNavigationItem?: string;
  brandTitle?: string;
  brandSubtitle?: string;
  homeUrl?: string;
  treatmentsUrl?: string;
  giftCardsUrl?: string;
  contactUrl?: string;
  bookingUrl?: string;
  bookingLabel?: string;
}>;

const defaultProps = {
  brandTitle: 'Juliet Rose',
  brandSubtitle: 'Beauty Studio',
  homeUrl: '/',
  treatmentsUrl: '/treatments',
  giftCardsUrl: '/gift-cards',
  contactUrl: '/#contact',
  bookingUrl: '/book',
  bookingLabel: 'Book an appointment',
} as const;

export function toActiveNavigationItem(
  pathname: string,
): '/' | '/treatments' | '/gift-cards' | undefined {
  if (pathname === '/') return '/';
  if (pathname === '/treatments') return '/treatments';
  if (pathname === '/gift-cards') return '/gift-cards';
  return undefined;
}

export function SiteHeader(props: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const brandTitle = props.brandTitle ?? defaultProps.brandTitle;
  const brandSubtitle = props.brandSubtitle ?? defaultProps.brandSubtitle;
  const homeUrl = props.homeUrl ?? defaultProps.homeUrl;
  const treatmentsUrl = props.treatmentsUrl ?? defaultProps.treatmentsUrl;
  const giftCardsUrl = props.giftCardsUrl ?? defaultProps.giftCardsUrl;
  const contactUrl = props.contactUrl ?? defaultProps.contactUrl;
  const bookingUrl = props.bookingUrl ?? defaultProps.bookingUrl;
  const bookingLabel = props.bookingLabel ?? defaultProps.bookingLabel;

  const explicitActive =
    props.activeNavigationItem === '' ? undefined : props.activeNavigationItem;
  const pathname =
    typeof window === 'undefined' ? '' : window.location.pathname;
  const activeNavigationItem =
    explicitActive ?? toActiveNavigationItem(pathname);

  const navigationItems = [
    { label: 'Home', href: homeUrl },
    { label: 'Treatments', href: treatmentsUrl },
    { label: 'Gift Cards', href: giftCardsUrl },
    { label: 'Contact', href: contactUrl },
  ] as const;

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.classList.toggle('menu-open', isMenuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [isMenuOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsMenuOpen(false);
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
    <header className={styles.root}>
      <div className={styles.inner}>
        <a className={styles.brand} href={homeUrl}>
          <span>{brandTitle}</span>
          <small>{brandSubtitle}</small>
        </a>

        <nav className={styles.desktopNav} aria-label="Main navigation">
          {navigationItems.map((item) => (
            <a
              aria-current={
                item.href === activeNavigationItem ? 'page' : undefined
              }
              className={
                item.href === activeNavigationItem
                  ? styles.isCurrent
                  : undefined
              }
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          className={`${styles.primaryButton} ${styles.headerBooking}`}
          href={bookingUrl}
        >
          {bookingLabel}{' '}
          <span className={styles.iconArrow} aria-hidden="true" />
        </a>

        <button
          className={styles.menuButton}
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
        className={styles.mobileNav}
        id="mobile-navigation"
        aria-label="Mobile navigation"
        hidden={!isMenuOpen}
      >
        {navigationItems.map((item) => (
          <a
            aria-current={
              item.href === activeNavigationItem ? 'page' : undefined
            }
            className={
              item.href === activeNavigationItem ? styles.isCurrent : undefined
            }
            href={item.href}
            key={item.href}
            onClick={() => setIsMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
        <a className={styles.primaryButton} href={bookingUrl}>
          {bookingLabel}{' '}
          <span className={styles.iconArrow} aria-hidden="true" />
        </a>
      </nav>
    </header>
  );
}
