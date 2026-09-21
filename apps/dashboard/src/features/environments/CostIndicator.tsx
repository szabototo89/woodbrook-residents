import { Text } from '@astryxdesign/core/Text';

export function CostIndicator(props: { cost: null }) {
  if (props.cost !== null) return null;
  return (
    <Text type="supporting" aria-label="Cost not tracked">
      —
    </Text>
  );
}
