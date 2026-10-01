export function GalleryPhotoNotFound() {
  return (
    <main id="main-content" className="section">
      <div className="container gallery-photo-not-found">
        <h1>Picture not found</h1>
        <p>This picture is unavailable. Explore the gallery to find another.</p>
        <a className="button button-primary" href="/gallery">
          Back to gallery
        </a>
      </div>
    </main>
  );
}
