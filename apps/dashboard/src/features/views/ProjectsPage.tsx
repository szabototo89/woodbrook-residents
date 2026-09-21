import { Heading } from '@astryxdesign/core/Heading';
import { List, ListItem } from '@astryxdesign/core/List';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';

import type { DashboardApp } from '../dashboard/registry';

export function ProjectsPage(props: { apps: DashboardApp[] }) {
  return (
    <Stack gap={3}>
      <Heading level={1}>Projects</Heading>
      <Text type="large">
        Workspace applications. Each project owns one local development
        environment.
      </Text>
      <List hasDividers>
        {props.apps.map((app) => (
          <ListItem
            key={app.name}
            label={app.name}
            description={`${app.stack} · ${Object.keys(app.scripts).length} scripts`}
            href={`/environments/${app.name}-local`}
          />
        ))}
      </List>
    </Stack>
  );
}
