export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <a
          className="wordmark wordmark-footer"
          href="/"
          aria-label="Laura Faichney All Things Art, home"
        >
          <span>Laura Faichney</span>
          <small>ALL THINGS ART</small>
        </a>
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
