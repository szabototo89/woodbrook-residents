import { Text } from '@astryxdesign/core/Text';

export function TTLIndicator(props: { ttl: null }) {
  if (props.ttl !== null) return null;
  return <Text type="supporting">No TTL</Text>;
}
