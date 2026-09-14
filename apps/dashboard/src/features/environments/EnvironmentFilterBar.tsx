import { Button } from '@astryxdesign/core/Button';
import { HStack } from '@astryxdesign/core/HStack';
import { Selector } from '@astryxdesign/core/Selector';
import { TextInput } from '@astryxdesign/core/TextInput';

import type {
  EnvironmentFilters,
  EnvironmentStatus,
  LifecycleFilter,
} from './environments';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'running', label: 'Running' },
  { value: 'starting', label: 'Starting' },
  { value: 'stopping', label: 'Stopping' },
  { value: 'stopped', label: 'Stopped' },
  { value: 'updating', label: 'Updating' },
  { value: 'paused', label: 'Paused' },
  { value: 'failed', label: 'Failed' },
  { value: 'unhealthy', label: 'Unhealthy' },
  { value: 'expired', label: 'Expired' },
  { value: 'deleting', label: 'Deleting' },
];

const STATUSES: EnvironmentStatus[] = [
  'running',
  'starting',
  'stopping',
  'stopped',
  'updating',
  'paused',
  'failed',
  'unhealthy',
  'expired',
  'deleting',
];

function toStatus(value: string): EnvironmentStatus | undefined {
  return STATUSES.find((status) => status === value);
}

const LIFECYCLES: LifecycleFilter[] = [
  'expiring-24h',
  'expiring-3d',
  'no-ttl',
  'inactive-7d',
];

function toLifecycle(value: string): LifecycleFilter | undefined {
  return LIFECYCLES.find((lifecycle) => lifecycle === value);
}

const LIFECYCLE_OPTIONS = [
  { value: '', label: 'All lifecycles' },
  { value: 'expiring-24h', label: 'Expiring in 24 hours' },
  { value: 'expiring-3d', label: 'Expiring in 3 days' },
  { value: 'no-ttl', label: 'No TTL' },
  { value: 'inactive-7d', label: 'Inactive over 7 days' },
];

export function EnvironmentFilterBar({
  filters,
  owners,
  templates,
  onChange,
  onClear,
}: {
  filters: EnvironmentFilters;
  owners: string[];
  templates: string[];
  onChange: (filters: EnvironmentFilters) => void;
  onClear: () => void;
}) {
  return (
    <HStack gap={3} align="end">
      <TextInput
        label="Search environments"
        value={filters.search ?? ''}
        onChange={(value) =>
          onChange({ ...filters, search: value || undefined })
        }
        placeholder="Search by name, project, or branch…"
      />
      <Selector
        label="Status"
        options={STATUS_OPTIONS}
        value={filters.status ?? ''}
        onChange={(value) =>
          onChange({
            ...filters,
            status: toStatus(value),
          })
        }
        presentation="adaptive"
      />
      <Selector
        label="Owner"
        options={[
          { value: '', label: 'Everyone' },
          ...owners.map((owner) => ({
            value: owner.toLowerCase(),
            label: owner,
          })),
        ]}
        value={filters.owner ?? ''}
        onChange={(value) =>
          onChange({ ...filters, owner: value || undefined })
        }
        presentation="adaptive"
      />
      <Selector
        label="Template"
        options={[
          { value: '', label: 'All templates' },
          ...templates.map((template) => ({
            value: template.toLowerCase(),
            label: template,
          })),
        ]}
        value={filters.template ?? ''}
        onChange={(value) =>
          onChange({ ...filters, template: value || undefined })
        }
        presentation="adaptive"
      />
      <Selector
        label="Lifecycle"
        options={LIFECYCLE_OPTIONS}
        value={filters.lifecycle ?? ''}
        onChange={(value) =>
          onChange({
            ...filters,
            lifecycle: toLifecycle(value),
          })
        }
        presentation="adaptive"
      />
      <Button label="Clear filters" variant="secondary" onClick={onClear} />
    </HStack>
  );
}
