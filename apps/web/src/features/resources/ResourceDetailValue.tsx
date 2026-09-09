import { GoogleMapsLink } from '../../components/GoogleMapsLink';
import type { Resource } from '../content/contentTypes';

type ResourceDetail = Resource['details'][number];

export function isAddressDetail(detail: ResourceDetail) {
  return detail.label.trim().toLocaleLowerCase('en-IE') === 'address';
}

export function ResourceDetailValue({ detail }: { detail: ResourceDetail }) {
  if (isAddressDetail(detail)) {
    return <GoogleMapsLink location={detail.value} />;
  }

  return detail.value;
}
