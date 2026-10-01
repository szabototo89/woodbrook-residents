export function GalleryCollectionNotFound() {
  return (
    <main id="main-content" className="section">
      <div className="container gallery-collection-not-found">
        <h1>Collection not found</h1>
        <p>
          This collection is unavailable. Explore the gallery to find another.
        </p>
        <a className="button button-primary" href="/gallery">
          Back to gallery
        </a>
      </div>
    </main>
  );
}
