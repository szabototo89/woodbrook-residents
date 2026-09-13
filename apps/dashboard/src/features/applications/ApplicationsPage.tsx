import { Card } from '@astryxdesign/core/Card';
import { CodeBlock } from '@astryxdesign/core/CodeBlock';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading } from '@astryxdesign/core/Heading';
import { Link } from '@astryxdesign/core/Link';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';

import { apps } from '../dashboard/registry';

export function ApplicationsPage() {
  return (
    <Stack gap={4}>
      <Stack gap={3}>
        <Heading level={1}>Applications</Heading>
        <Text type="large">
          Every workspace application with its stack, local URL, and key
          scripts.
        </Text>
      </Stack>
      <Grid columns={{ minWidth: 280 }} gap={4}>
        {apps.map((app) => (
          <Card key={app.name}>
            <Stack gap={3}>
              <Heading level={2}>{app.name}</Heading>
              <Text>{app.description}</Text>
              <Text type="supporting">{app.stack}</Text>
              <Link href={app.localUrl} isStandalone>
                {app.localUrl}
              </Link>
              <CodeBlock
                title={`${app.name} scripts`}
                language="bash"
                size="sm"
                code={Object.entries(app.scripts)
                  .map(([name, command]) => `# ${name}\n${command}`)
                  .join('\n')}
              />
            </Stack>
          </Card>
        ))}
      </Grid>
    </Stack>
  );
}
