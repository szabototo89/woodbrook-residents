import { Heading } from '@astryxdesign/core/Heading';
import { Link } from '@astryxdesign/core/Link';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';

import {
  summarizeEnvironments,
  type WorkspaceEnvironment,
} from '../environments/environments';

export function OverviewPage({
  environments,
}: {
  environments: WorkspaceEnvironment[];
}) {
  const summary = summarizeEnvironments(environments);
  return (
    <Stack gap={3}>
      <Heading level={1}>Overview</Heading>
      <Text type="large">
        {summary.running} running · {summary.stopped} stopped · {summary.failed}{' '}
        failed · {summary.expiring} expiring soon
      </Text>
      <Text type="supporting">
        This workspace tracks {summary.total} local development targets. Start
        from the <Link href="/environments">environments</Link> inventory.
      </Text>
    </Stack>
  );
}
