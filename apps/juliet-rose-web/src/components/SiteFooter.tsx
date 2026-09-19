const footerItems = [
  { label: 'Home', href: '#top' },
  { label: 'Treatments', href: '#treatments' },
  { label: 'Gift Cards', href: '#gift-cards' },
  { label: 'Contact', href: '#contact' },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main page-width">
        <a className="brand footer-brand" href="#top">
          <span>Juliet Rose</span>
          <small>Beauty Studio</small>
        </a>
        <nav className="footer-navigation" aria-label="Footer navigation">
          {footerItems.map((item, index) => (
            <a
              className={index === 0 ? 'is-current' : undefined}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="social-links" aria-label="Social media">
          <a href="https://www.instagram.com/" aria-label="Instagram">
            <span className="icon-instagram" aria-hidden="true" />
          </a>
          <a href="https://www.facebook.com/" aria-label="Facebook">
            <span className="icon-facebook" aria-hidden="true" />
          </a>
        </div>
        <span className="footer-rule" aria-hidden="true" />
        <p className="tagline">Relax and Revitalize</p>
      </div>

      <div className="footer-bottom page-width">
        <p>© 2026 Juliet Rose beauty studio. All rights reserved.</p>
      </div>
    </footer>
  );
}
