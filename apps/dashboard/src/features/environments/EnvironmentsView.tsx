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

export function EnvironmentsView({
  environments,
  filters,
  onFiltersChange,
}: {
  environments: WorkspaceEnvironment[];
  filters: EnvironmentFilters;
  onFiltersChange: (filters: EnvironmentFilters) => void;
}) {
  const visible = filterEnvironments(environments, filters);
  const summary = summarizeEnvironments(environments);
  const owners = [...new Set(environments.map((env) => env.owner))].sort();
  const templates = [...new Set(environments.map((env) => env.project))].sort();

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
            onFiltersChange({ ...filters, status: 'failed' });
            return;
          }
          if (selection === 'expiring') {
            onFiltersChange({ ...filters, lifecycle: 'expiring-24h' });
            return;
          }
          onFiltersChange({ ...filters, status: selection });
        }}
      />
      <EnvironmentFilterBar
        filters={filters}
        owners={owners}
        templates={templates}
        onChange={onFiltersChange}
        onClear={() => onFiltersChange({})}
      />
      <EnvironmentsTable
        environments={visible}
        onClearFilters={() => onFiltersChange({})}
      />
    </Stack>
  );
}
