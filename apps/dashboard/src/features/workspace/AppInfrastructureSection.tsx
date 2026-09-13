import { Heading } from '@astryxdesign/core/Heading';
import { List, ListItem } from '@astryxdesign/core/List';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';

import type { DashboardApp } from '../dashboard/registry';
import { infraLinks } from '../dashboard/registry';
import { getAppInfraLinks } from '../dashboard/appFocus';

export function AppInfrastructureSection({ app }: { app: DashboardApp }) {
  const links = getAppInfraLinks(app, infraLinks);
  return (
    <Stack gap={3}>
      <Heading level={1}>Infrastructure</Heading>
      <Text type="large">Consoles and docs relevant to {app.name}.</Text>
      <List hasDividers>
        {links.map((link) => (
          <ListItem
            key={link.label}
            label={link.label}
            description={link.group}
            href={link.url}
          />
        ))}
      </List>
    </Stack>
  );
}
