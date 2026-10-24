import { Text } from '@astryxdesign/core/Text';

type CostIndicatorProps = { cost: null };

export function CostIndicator(props: CostIndicatorProps) {
  if (props.cost !== null) return null;
  return (
    <Text type="supporting" aria-label="Cost not tracked">
      —
    </Text>
  );
}
