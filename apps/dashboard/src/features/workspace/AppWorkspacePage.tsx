import { CodeBlock } from '@astryxdesign/core/CodeBlock';
import { Heading } from '@astryxdesign/core/Heading';
import { Link } from '@astryxdesign/core/Link';
import { List, ListItem } from '@astryxdesign/core/List';
import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';
import { useEffect } from 'react';

import type { DashboardApp } from '../dashboard/registry';
import { actions, infraLinks } from '../dashboard/registry';
import { getAppActions, getAppInfraLinks } from '../dashboard/appFocus';

const SELECTED_APP_KEY = 'dashboard.selectedApp';

export function AppWorkspacePage({ app }: { app: DashboardApp }) {
  const links = getAppInfraLinks(app, infraLinks);
  const { appActions, workspaceActions } = getAppActions(app.name, actions);

  useEffect(() => {
    window.localStorage.setItem(SELECTED_APP_KEY, app.name);
  }, [app.name]);

  return (
    <Stack gap={6}>
      <Stack gap={3}>
        <Text type="label">Developer dashboard</Text>
        <Heading level={1}>{app.name}</Heading>
        <Text type="large">{app.description}</Text>
        <Text type="supporting">{app.stack}</Text>
        <Link href={app.localUrl} isStandalone>
          {app.localUrl}
        </Link>
      </Stack>
      <Stack gap={3}>
        <Heading level={2}>Scripts</Heading>
        <CodeBlock
          title={`${app.name} scripts`}
          language="bash"
          size="sm"
          code={Object.entries(app.scripts)
            .map(([name, command]) => `# ${name}\n${command}`)
            .join('\n')}
        />
      </Stack>
      <Stack gap={3}>
        <Heading level={2}>Infrastructure for {app.name}</Heading>
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
      {appActions.length > 0 && (
        <Stack gap={3}>
          <Heading level={2}>{app.name} actions</Heading>
          <List hasDividers>
            {appActions.map((action) => (
              <ListItem
                key={action.label}
                label={action.label}
                description={<Text type="code">{action.command}</Text>}
              />
            ))}
          </List>
        </Stack>
      )}
      <Stack gap={3}>
        <Heading level={2}>Workspace actions</Heading>
        <List hasDividers>
          {workspaceActions.map((action) => (
            <ListItem
              key={action.label}
              label={action.label}
              description={<Text type="code">{action.command}</Text>}
            />
          ))}
        </List>
      </Stack>
    </Stack>
  );
}

export function readSelectedApp(fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  return window.localStorage.getItem(SELECTED_APP_KEY) ?? fallback;
}
