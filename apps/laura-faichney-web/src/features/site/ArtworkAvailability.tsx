import type { CmsGalleryItem } from './lauraSanity';

export function artworkAvailabilityLabel(status: CmsGalleryItem['saleStatus']) {
  if (status === 'for-sale') return 'For sale';
  if (status === 'not-for-sale') return 'Not for sale';
  return undefined;
}

export function ArtworkAvailability(props: {
  status: CmsGalleryItem['saleStatus'];
}) {
  const label = artworkAvailabilityLabel(props.status);
  if (!label) return null;

  return (
    <span className="artwork-availability" data-sale-status={props.status}>
      <span className="artwork-availability-dot" aria-hidden="true" />
      {label}
    </span>
  );
}
