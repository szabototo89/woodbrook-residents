import { ArrowUpRight } from 'lucide-react';

type GoogleMapsLinkProps = {
  location: string;
};

export function createGoogleMapsUrl(location: string) {
  const search = new URLSearchParams({ api: '1', query: location });
  return `https://www.google.com/maps/search/?${search.toString()}`;
}

export function GoogleMapsLink({ location }: GoogleMapsLinkProps) {
  return (
    <a
      className="detail-location-link"
      href={createGoogleMapsUrl(location)}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${location} in Google Maps`}
    >
      {location}
      <ArrowUpRight size={15} aria-hidden="true" />
    </a>
  );
}
