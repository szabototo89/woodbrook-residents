import { Card } from '@astryxdesign/core/Card';
import { CodeBlock } from '@astryxdesign/core/CodeBlock';
import { Grid } from '@astryxdesign/core/Grid';
import { Heading } from '@astryxdesign/core/Heading';
import { Link } from '@astryxdesign/core/Link';
import { List, ListItem } from '@astryxdesign/core/List';
import { Section } from '@astryxdesign/core/Section';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';

import { actions, apps, infraLinks } from './registry';

export function DashboardPage() {
  return (
    <main id="main-content" className="dashboard-main">
      <Stack gap={8}>
        <Stack gap={3}>
          <Text type="label">Woodbrook · Developer dashboard</Text>
          <Heading level={1}>Workspace status and actions</Heading>
          <Text type="large">
            Tracked applications, infrastructure deep-links, and runnable
            workspace actions for software engineers.
          </Text>
        </Stack>

        <Section>
          <Stack gap={4}>
            <Heading level={2} id="apps-heading">
              Applications
            </Heading>
            <Grid columns={{ minWidth: 280 }} gap={4}>
              {apps.map((app) => (
                <Card key={app.name}>
                  <Stack gap={3}>
                    <Heading level={3}>{app.name}</Heading>
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
        </Section>

        <Section>
          <Stack gap={4}>
            <Heading level={2} id="infra-heading">
              Infrastructure
            </Heading>
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
        </Section>

        <Section>
          <Stack gap={4}>
            <Heading level={2} id="actions-heading">
              Build actions
            </Heading>
            <List hasDividers>
              {actions.map((action) => (
                <ListItem
                  key={action.label}
                  label={action.label}
                  description={<Text type="code">{action.command}</Text>}
                />
              ))}
            </List>
          </Stack>
        </Section>
      </Stack>
    </main>
  );
}
