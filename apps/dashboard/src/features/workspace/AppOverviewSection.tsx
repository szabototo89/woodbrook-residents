import { Link } from '@astryxdesign/core/Link';
import { Heading } from '@astryxdesign/core/Heading';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';

import type { DashboardApp } from '../dashboard/registry';

export function AppOverviewSection({ app }: { app: DashboardApp }) {
  const scriptCount = Object.keys(app.scripts).length;
  return (
    <Stack gap={3}>
      <Text type="label">Developer dashboard</Text>
      <Heading level={1}>{app.name}</Heading>
      <Text type="large">{app.description}</Text>
      <Text type="supporting">{app.stack}</Text>
      <Link href={app.localUrl} isStandalone>
        {app.localUrl}
      </Link>
      <Text type="supporting">
        {scriptCount} {scriptCount === 1 ? 'script' : 'scripts'} documented for
        this application.
      </Text>
    </Stack>
  );
}
