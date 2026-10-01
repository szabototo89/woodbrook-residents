import type { CmsGalleryItem } from './lauraSanity';

export function artworkAvailabilityLabel(status: CmsGalleryItem['saleStatus']) {
  if (status === 'for-sale') return 'For sale';
  if (status === 'not-for-sale') return 'Not for sale';
  return 'Enquire for availability';
}

export function ArtworkAvailability(props: {
  status: CmsGalleryItem['saleStatus'];
}) {
  return (
    <span
      className="artwork-availability"
      data-sale-status={props.status ?? 'unconfirmed'}
    >
      <span className="artwork-availability-dot" aria-hidden="true" />
      {artworkAvailabilityLabel(props.status)}
    </span>
  );
}
