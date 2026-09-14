import { Heading } from '@astryxdesign/core/Heading';
import { List, ListItem } from '@astryxdesign/core/List';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';

import type { DashboardAction } from '../dashboard/registry';

export function ActivityPage({ actions }: { actions: DashboardAction[] }) {
  return (
    <Stack gap={3}>
      <Heading level={1}>Activity</Heading>
      <Text type="large">
        No event history is recorded. These are the documented workspace
        commands available to run.
      </Text>
      <List hasDividers>
        {actions.map((action) => (
          <ListItem
            key={action.label}
            label={action.label}
            description={<Text type="code">{action.command}</Text>}
          />
        ))}
      </List>
    </Stack>
  );
}
