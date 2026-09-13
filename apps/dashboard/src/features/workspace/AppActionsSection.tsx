import { Heading } from '@astryxdesign/core/Heading';
import { List, ListItem } from '@astryxdesign/core/List';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';

import type { DashboardApp } from '../dashboard/registry';
import { actions } from '../dashboard/registry';
import { getAppActions } from '../dashboard/appFocus';

export function AppActionsSection({ app }: { app: DashboardApp }) {
  const { appActions, workspaceActions } = getAppActions(app.name, actions);
  return (
    <Stack gap={6}>
      <Stack gap={3}>
        <Heading level={1}>Actions</Heading>
        {appActions.length > 0 && (
          <List hasDividers>
            {appActions.map((action) => (
              <ListItem
                key={action.label}
                label={action.label}
                description={<Text type="code">{action.command}</Text>}
              />
            ))}
          </List>
        )}
      </Stack>
      <Stack gap={3}>
        <Heading level={2}>Workspace actions</Heading>
        <List hasDividers>
          {workspaceActions.map((action) => (
            <ListItem
              key={action.label}
              label={action.label}
              description={<Text type="code">{action.command}</Text>}
            />
          ))}
        </List>
      </Stack>
    </Stack>
  );
}
