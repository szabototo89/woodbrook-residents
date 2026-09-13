import { Heading } from '@astryxdesign/core/Heading';
import { List, ListItem } from '@astryxdesign/core/List';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';

import { actions } from '../dashboard/registry';

export function ActionsPage() {
  return (
    <Stack gap={4}>
      <Stack gap={3}>
        <Heading level={1}>Build actions</Heading>
        <Text type="large">
          Runnable workspace commands. Run them from the repository root.
        </Text>
      </Stack>
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
