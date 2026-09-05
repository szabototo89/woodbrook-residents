import { Link } from '@tanstack/react-router';

export function NotFoundPage() {
  return (
    <main id="main-content" className="not-found shell narrow">
      <p className="eyebrow">404</p>
      <h1>That page could not be found</h1>
      <p>
        The address may have changed, or the community information may no longer
        be published.
      </p>
      <Link className="button" to="/">
        Return to the homepage
      </Link>
    </main>
  );
}
