import { BrandLogo } from '../../components/BrandLogo';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <BrandLogo footer />
        <nav aria-label="Footer navigation">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/services">Services</a>
          <a href="/gallery">Gallery</a>
          <a href="/contact">Contact</a>
        </nav>
        <small>
          © {new Date().getFullYear()} Laura Faichney All Things Art
        </small>
      </div>
    </footer>
  );
}
