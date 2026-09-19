import { Heading } from '@astryxdesign/core/Heading';
import { List, ListItem } from '@astryxdesign/core/List';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';

import type { InfraLink } from '../dashboard/registry';

export function InfrastructurePage(props: { links: InfraLink[] }) {
  return (
    <Stack gap={3}>
      <Heading level={1}>Infrastructure</Heading>
      <Text type="large">
        Consoles and docs discovered from repository config and docs.
      </Text>
      <List hasDividers>
        {props.links.map((link) => (
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
