import { Link } from '@astryxdesign/core/Link';
import { Heading } from '@astryxdesign/core/Heading';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';

import type { DashboardApp } from '../dashboard/registry';

export function AppOverviewSection(props: { app: DashboardApp }) {
  const scriptCount = Object.keys(props.app.scripts).length;
  return (
    <Stack gap={3}>
      <Text type="label">Developer dashboard</Text>
      <Heading level={1}>{props.app.name}</Heading>
      <Text type="large">{props.app.description}</Text>
      <Text type="supporting">{props.app.stack}</Text>
      <Link href={props.app.localUrl} isStandalone>
        {props.app.localUrl}
      </Link>
      <Text type="supporting">
        {scriptCount} {scriptCount === 1 ? 'script' : 'scripts'} documented for
        this application.
      </Text>
    </Stack>
  );
}
