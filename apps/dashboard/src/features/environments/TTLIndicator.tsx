import { Text } from '@astryxdesign/core/Text';

export function TTLIndicator({ ttl }: { ttl: null }) {
  if (ttl !== null) return null;
  return <Text type="supporting">No TTL</Text>;
}
