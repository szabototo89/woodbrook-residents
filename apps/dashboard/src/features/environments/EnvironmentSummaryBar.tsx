import { Button } from '@astryxdesign/core/Button';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';

import type { EnvironmentSummary } from './environments';

export function EnvironmentSummaryBar({
  summary,
  onSelectStatus,
}: {
  summary: EnvironmentSummary;
  onSelectStatus: (
    status: 'running' | 'stopped' | 'failed' | 'expiring',
  ) => void;
}) {
  return (
    <HStack gap={2} align="center">
      <Button
        label={`${summary.running} running`}
        variant="secondary"
        size="sm"
        onClick={() => onSelectStatus('running')}
      />
      <Button
        label={`${summary.stopped} stopped`}
        variant="secondary"
        size="sm"
        onClick={() => onSelectStatus('stopped')}
      />
      <Button
        label={`${summary.failed} failed`}
        variant="secondary"
        size="sm"
        onClick={() => onSelectStatus('failed')}
      />
      <Button
        label={`${summary.expiring} expiring soon`}
        variant="secondary"
        size="sm"
        onClick={() => onSelectStatus('expiring')}
      />
      <Text type="supporting">Cost tracking is not configured.</Text>
    </HStack>
  );
}
