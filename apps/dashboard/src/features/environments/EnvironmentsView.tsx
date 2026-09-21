import { Heading } from '@astryxdesign/core/Heading';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';

import { EnvironmentFilterBar } from './EnvironmentFilterBar';
import { EnvironmentSummaryBar } from './EnvironmentSummaryBar';
import { EnvironmentsTable } from './EnvironmentsTable';
import {
  filterEnvironments,
  summarizeEnvironments,
  type EnvironmentFilters,
  type WorkspaceEnvironment,
} from './environments';

export function EnvironmentsView(props: {
  environments: WorkspaceEnvironment[];
  filters: EnvironmentFilters;
  onFiltersChange: (filters: EnvironmentFilters) => void;
}) {
  const visible = filterEnvironments(props.environments, props.filters);
  const summary = summarizeEnvironments(props.environments);
  const owners = [
    ...new Set(props.environments.map((env) => env.owner)),
  ].sort();
  const templates = [
    ...new Set(props.environments.map((env) => env.project)),
  ].sort();

  return (
    <Stack gap={4}>
      <Heading level={1}>Environments</Heading>
      <Text type="supporting">
        Local development targets derived from the workspace registry. Status
        reflects documented targets, not a live probe.
      </Text>
      <EnvironmentSummaryBar
        summary={summary}
        onSelectStatus={(selection) => {
          if (selection === 'failed') {
            props.onFiltersChange({ ...props.filters, status: 'failed' });
            return;
          }
          if (selection === 'expiring') {
            props.onFiltersChange({
              ...props.filters,
              lifecycle: 'expiring-24h',
            });
            return;
          }
          props.onFiltersChange({ ...props.filters, status: selection });
        }}
      />
      <EnvironmentFilterBar
        filters={props.filters}
        owners={owners}
        templates={templates}
        onChange={props.onFiltersChange}
        onClear={() => props.onFiltersChange({})}
      />
      <EnvironmentsTable
        environments={visible}
        onClearFilters={() => props.onFiltersChange({})}
      />
    </Stack>
  );
}
