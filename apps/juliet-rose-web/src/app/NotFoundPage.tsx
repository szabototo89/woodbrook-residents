import { Link } from '@tanstack/react-router';

export function NotFoundPage() {
  return (
    <main id="main-content" className="not-found page-width">
      <meta name="robots" content="noindex" />
      <p className="eyebrow">404</p>
      <h1>That page could not be found</h1>
      <p>The address may have changed.</p>
      <Link className="primary-button" to="/">
        Return to the homepage
      </Link>
    </main>
  );
}
