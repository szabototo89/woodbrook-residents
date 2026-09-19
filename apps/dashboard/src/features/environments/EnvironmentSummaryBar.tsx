import { Button } from '@astryxdesign/core/Button';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';

import type { EnvironmentSummary } from './environments';

export function EnvironmentSummaryBar(props: {
  summary: EnvironmentSummary;
  onSelectStatus: (
    status: 'running' | 'stopped' | 'failed' | 'expiring',
  ) => void;
}) {
  return (
    <HStack gap={2} align="center">
      <Button
        label={`${props.summary.running} running`}
        variant="secondary"
        size="sm"
        onClick={() => props.onSelectStatus('running')}
      />
      <Button
        label={`${props.summary.stopped} stopped`}
        variant="secondary"
        size="sm"
        onClick={() => props.onSelectStatus('stopped')}
      />
      <Button
        label={`${props.summary.failed} failed`}
        variant="secondary"
        size="sm"
        onClick={() => props.onSelectStatus('failed')}
      />
      <Button
        label={`${props.summary.expiring} expiring soon`}
        variant="secondary"
        size="sm"
        onClick={() => props.onSelectStatus('expiring')}
      />
      <Text type="supporting">Cost tracking is not configured.</Text>
    </HStack>
  );
}
