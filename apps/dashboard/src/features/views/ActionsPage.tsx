import { Heading } from '@astryxdesign/core/Heading';
import { List, ListItem } from '@astryxdesign/core/List';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';

import type { DashboardAction } from '../dashboard/registry';

export function ActionsPage({ actions }: { actions: DashboardAction[] }) {
  return (
    <Stack gap={3}>
      <Heading level={1}>Actions</Heading>
      <Text type="large">
        Runnable workspace commands. Actions document commands only; nothing
        executes remotely.
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
