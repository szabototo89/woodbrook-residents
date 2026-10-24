import { Text } from '@astryxdesign/core/Text';

type TTLIndicatorProps = { ttl: null };

export function TTLIndicator(props: TTLIndicatorProps) {
  if (props.ttl !== null) return null;
  return <Text type="supporting">No TTL</Text>;
}
