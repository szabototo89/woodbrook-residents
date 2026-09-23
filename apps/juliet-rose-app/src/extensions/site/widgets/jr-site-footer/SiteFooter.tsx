import styles from './site-footer.module.css';

export type SiteFooterProps = Readonly<{
  brandTitle?: string;
  brandSubtitle?: string;
  homeUrl?: string;
  treatmentsUrl?: string;
  giftCardsUrl?: string;
  contactUrl?: string;
  instagramUrl?: string;
  tagline?: string;
  copyright?: string;
}>;

const defaultProps = {
  brandTitle: 'Juliet Rose',
  brandSubtitle: 'Beauty Studio',
  homeUrl: '/',
  treatmentsUrl: '/treatments',
  giftCardsUrl: '/gift-cards',
  contactUrl: '/#contact',
  instagramUrl: 'https://www.instagram.com/juliet_rose_beauty_/',
  tagline: 'Relax and Revitalize',
  copyright: '© 2026 Juliet Rose beauty studio. All rights reserved.',
} as const;

export function SiteFooter(props: SiteFooterProps) {
  const brandTitle = props.brandTitle ?? defaultProps.brandTitle;
  const brandSubtitle = props.brandSubtitle ?? defaultProps.brandSubtitle;
  const homeUrl = props.homeUrl ?? defaultProps.homeUrl;
  const treatmentsUrl = props.treatmentsUrl ?? defaultProps.treatmentsUrl;
  const giftCardsUrl = props.giftCardsUrl ?? defaultProps.giftCardsUrl;
  const contactUrl = props.contactUrl ?? defaultProps.contactUrl;
  const instagramUrl = props.instagramUrl ?? defaultProps.instagramUrl;
  const tagline = props.tagline ?? defaultProps.tagline;
  const copyright = props.copyright ?? defaultProps.copyright;

  const footerItems = [
    { label: 'Home', href: homeUrl },
    { label: 'Treatments', href: treatmentsUrl },
    { label: 'Gift Cards', href: giftCardsUrl },
    { label: 'Contact', href: contactUrl },
  ] as const;

  return (
    <footer className={styles.root}>
      <div className={`${styles.main} ${styles.pageWidth}`}>
        <a className={`${styles.brand} ${styles.footerBrand}`} href={homeUrl}>
          <span>{brandTitle}</span>
          <small>{brandSubtitle}</small>
        </a>
        <nav className={styles.footerNav} aria-label="Footer navigation">
          {footerItems.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className={styles.socialLinks} aria-label="Social media">
          <a href={instagramUrl} aria-label="Instagram">
            <span className={styles.iconInstagram} aria-hidden="true" />
          </a>
        </div>
        <span className={styles.footerRule} aria-hidden="true" />
        <p className={styles.tagline}>{tagline}</p>
      </div>

      <div className={`${styles.bottom} ${styles.pageWidth}`}>
        <p>{copyright}</p>
      </div>
    </footer>
  );
}
