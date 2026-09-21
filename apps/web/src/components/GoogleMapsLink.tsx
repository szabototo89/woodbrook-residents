import { ArrowUpRight } from 'lucide-react';

type GoogleMapsLinkProps = {
  location: string;
};

export function createGoogleMapsUrl(location: string) {
  const search = new URLSearchParams({ api: '1', query: location });
  return `https://www.google.com/maps/search/?${search.toString()}`;
}

export function GoogleMapsLink(props: GoogleMapsLinkProps) {
  return (
    <a
      className="detail-location-link"
      href={createGoogleMapsUrl(props.location)}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${props.location} in Google Maps`}
    >
      {props.location}
      <ArrowUpRight size={15} aria-hidden="true" />
    </a>
  );
}
