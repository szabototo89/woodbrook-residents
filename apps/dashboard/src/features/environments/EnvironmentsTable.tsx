import { Button } from '@astryxdesign/core/Button';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { HStack } from '@astryxdesign/core/HStack';
import { Link } from '@astryxdesign/core/Link';
import { proportional, pixel, Table } from '@astryxdesign/core/Table';
import { Text } from '@astryxdesign/core/Text';

import { CostIndicator } from './CostIndicator';
import { StatusBadge } from './StatusBadge';
import { TTLIndicator } from './TTLIndicator';
import type { WorkspaceEnvironment } from './environments';

export function EnvironmentsTable({
  environments,
  onClearFilters,
}: {
  environments: WorkspaceEnvironment[];
  onClearFilters?: () => void;
}) {
  return (
    <Table
      data={environments}
      idKey="id"
      density="compact"
      dividers="rows"
      hasHover
      emptyState={
        <EmptyState
          title="No environments match these filters"
          description="Try adjusting the search or clearing the filters."
          actions={
            onClearFilters ? (
              <Button label="Clear filters" onClick={onClearFilters} />
            ) : undefined
          }
        />
      }
      columns={[
        {
          key: 'name',
          header: 'Environment',
          width: proportional(2),
          renderCell: (env) => (
            <HStack gap={2} align="center">
              <Link href={`/environments/${env.id}`} isStandalone>
                {env.name}
              </Link>
              <Text type="code">{env.branch}</Text>
            </HStack>
          ),
        },
        {
          key: 'status',
          header: 'Status',
          width: proportional(1),
          renderCell: (env) => <StatusBadge status={env.status} />,
        },
        {
          key: 'owner',
          header: 'Owner',
          width: proportional(1),
          renderCell: (env) => <Text type="supporting">{env.owner}</Text>,
        },
        {
          key: 'ttl',
          header: 'TTL',
          width: pixel(110),
          renderCell: (env) => <TTLIndicator ttl={env.ttl} />,
        },
        {
          key: 'cost',
          header: 'Cost',
          width: pixel(110),
          align: 'end',
          renderCell: (env) => <CostIndicator cost={env.cost} />,
        },
        {
          key: 'actions',
          header: 'Actions',
          width: pixel(120),
          align: 'end',
          renderCell: (env) => (
            <Link href={`/environments/${env.id}`} isStandalone>
              View
            </Link>
          ),
        },
      ]}
    />
  );
}
