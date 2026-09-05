import { RefreshCw } from 'lucide-react';

export function CmsUnavailable() {
  return (
    <div className="notice-card" role="status">
      <RefreshCw size={22} aria-hidden="true" />
      <div>
        <h2>Community information is temporarily unavailable</h2>
        <p>
          The content service could not be reached. Please try again shortly; no
          substitute or placeholder information is being shown.
        </p>
      </div>
    </div>
  );
}
