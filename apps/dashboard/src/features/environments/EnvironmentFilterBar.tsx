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

export function EnvironmentFilterBar(props: {
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
        value={props.filters.search ?? ''}
        onChange={(value) =>
          props.onChange({ ...props.filters, search: value || undefined })
        }
        placeholder="Search by name, project, or branch…"
      />
      <Selector
        label="Status"
        options={STATUS_OPTIONS}
        value={props.filters.status ?? ''}
        onChange={(value) =>
          props.onChange({
            ...props.filters,
            status: toStatus(value),
          })
        }
        presentation="adaptive"
      />
      <Selector
        label="Owner"
        options={[
          { value: '', label: 'Everyone' },
          ...props.owners.map((owner) => ({
            value: owner.toLowerCase(),
            label: owner,
          })),
        ]}
        value={props.filters.owner ?? ''}
        onChange={(value) =>
          props.onChange({ ...props.filters, owner: value || undefined })
        }
        presentation="adaptive"
      />
      <Selector
        label="Template"
        options={[
          { value: '', label: 'All templates' },
          ...props.templates.map((template) => ({
            value: template.toLowerCase(),
            label: template,
          })),
        ]}
        value={props.filters.template ?? ''}
        onChange={(value) =>
          props.onChange({ ...props.filters, template: value || undefined })
        }
        presentation="adaptive"
      />
      <Selector
        label="Lifecycle"
        options={LIFECYCLE_OPTIONS}
        value={props.filters.lifecycle ?? ''}
        onChange={(value) =>
          props.onChange({
            ...props.filters,
            lifecycle: toLifecycle(value),
          })
        }
        presentation="adaptive"
      />
      <Button
        label="Clear filters"
        variant="secondary"
        onClick={props.onClear}
      />
    </HStack>
  );
}
