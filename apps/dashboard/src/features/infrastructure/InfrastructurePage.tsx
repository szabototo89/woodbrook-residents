import { Heading } from '@astryxdesign/core/Heading';
import { List, ListItem } from '@astryxdesign/core/List';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';

import { infraLinks } from '../dashboard/registry';

export function InfrastructurePage() {
  return (
    <Stack gap={4}>
      <Stack gap={3}>
        <Heading level={1}>Infrastructure</Heading>
        <Text type="large">
          Consoles and documentation for source control, hosting, content, and
          analytics.
        </Text>
      </Stack>
      <List hasDividers>
        {infraLinks.map((link) => (
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
