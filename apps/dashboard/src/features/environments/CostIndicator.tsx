import { Text } from '@astryxdesign/core/Text';

export function CostIndicator({ cost }: { cost: null }) {
  if (cost !== null) return null;
  return (
    <Text type="supporting" aria-label="Cost not tracked">
      —
    </Text>
  );
}
