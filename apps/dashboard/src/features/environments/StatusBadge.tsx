import { HStack } from '@astryxdesign/core/HStack';
import { StatusDot } from '@astryxdesign/core/StatusDot';
import { Text } from '@astryxdesign/core/Text';

import { getStatusMeta, type EnvironmentStatus } from './environments';

type StatusBadgeProps = { status: EnvironmentStatus };

export function StatusBadge(props: StatusBadgeProps) {
  const meta = getStatusMeta(props.status);
  return (
    <HStack gap={2} align="center">
      <StatusDot
        variant={meta.variant}
        label={meta.label}
        isPulsing={meta.isPulsing}
      />
      <Text type="supporting">{meta.label}</Text>
    </HStack>
  );
}
