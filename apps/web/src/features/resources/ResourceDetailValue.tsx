import { GoogleMapsLink } from '../../components/GoogleMapsLink';
import type { Resource } from '../content/contentTypes';

type ResourceDetail = Resource['details'][number];

export function isAddressDetail(detail: ResourceDetail) {
  return detail.label.trim().toLocaleLowerCase('en-IE') === 'address';
}

export function ResourceDetailValue(props: { detail: ResourceDetail }) {
  if (isAddressDetail(props.detail)) {
    return <GoogleMapsLink location={props.detail.value} />;
  }

  return props.detail.value;
}
