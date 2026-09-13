import { Card } from '@astryxdesign/core/Card';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading } from '@astryxdesign/core/Heading';
import { List, ListItem } from '@astryxdesign/core/List';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';

import { actions, apps, infraLinks } from '../dashboard/registry';

export function OverviewPage() {
  return (
    <Stack gap={6}>
      <Stack gap={3}>
        <Text type="label">Woodbrook · Developer dashboard</Text>
        <Heading level={1}>Overview</Heading>
        <Text type="large">
          Workspace status at a glance. Open a section in the sidebar for
          details.
        </Text>
      </Stack>
      <Grid columns={{ minWidth: 200 }} gap={4}>
        <Card>
          <Stack gap={1}>
            <Heading level={2} type="display-3">
              {String(apps.length)}
            </Heading>
            <Text type="supporting">Tracked applications</Text>
          </Stack>
        </Card>
        <Card>
          <Stack gap={1}>
            <Heading level={2} type="display-3">
              {String(infraLinks.length)}
            </Heading>
            <Text type="supporting">Infrastructure links</Text>
          </Stack>
        </Card>
        <Card>
          <Stack gap={1}>
            <Heading level={2} type="display-3">
              {String(actions.length)}
            </Heading>
            <Text type="supporting">Build actions</Text>
          </Stack>
        </Card>
      </Grid>
      <Stack gap={3}>
        <Heading level={2}>Start here</Heading>
        <List hasDividers>
          <ListItem
            label="Open the public site locally"
            description={<Text type="code">http://localhost:3000</Text>}
            href="http://localhost:3000"
          />
          <ListItem
            label="Open the CMS admin locally"
            description={<Text type="code">http://localhost:1337/admin</Text>}
            href="http://localhost:1337/admin"
          />
          <ListItem
            label="GitHub repository"
            description="source of truth for code and workflows"
            href="https://github.com/szabototo89/woodbrook-residents"
          />
        </List>
      </Stack>
    </Stack>
  );
}
