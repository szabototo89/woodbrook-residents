import { Heading } from '@astryxdesign/core/Heading';
import { Link } from '@astryxdesign/core/Link';
import { List, ListItem } from '@astryxdesign/core/List';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';

import type { DashboardApp } from '../dashboard/registry';

export function TemplatesPage(props: { apps: DashboardApp[] }) {
  return (
    <Stack gap={3}>
      <Heading level={1}>Templates</Heading>
      <Text type="large">
        Stacks used by workspace environments. Templates are added as data in
        the registry.
      </Text>
      <List hasDividers>
        {props.apps.map((app) => (
          <ListItem
            key={app.name}
            label={app.stack}
            description={`Used by ${app.name}`}
            href={`/environments/${app.name}-local`}
          />
        ))}
      </List>
      <Link href="/environments" isStandalone>
        Create an environment from a template by adding it to the registry
      </Link>
    </Stack>
  );
}
