import { CodeBlock } from '@astryxdesign/core/CodeBlock';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { Heading } from '@astryxdesign/core/Heading';
import { HStack } from '@astryxdesign/core/HStack';
import { Link } from '@astryxdesign/core/Link';
import { Stack } from '@astryxdesign/core/Stack';
import { Tab, TabList } from '@astryxdesign/core/TabList';
import { Text } from '@astryxdesign/core/Text';

import type { DashboardApp } from '../dashboard/registry';
import { AppActionsSection } from '../workspace/AppActionsSection';
import { AppInfrastructureSection } from '../workspace/AppInfrastructureSection';
import { AppScriptsSection } from '../workspace/AppScriptsSection';
import { CostIndicator } from './CostIndicator';
import { StatusBadge } from './StatusBadge';
import { TTLIndicator } from './TTLIndicator';
import type { WorkspaceEnvironment } from './environments';

export type EnvironmentTab =
  'overview' | 'scripts' | 'infrastructure' | 'actions' | 'logs';

const TABS: Array<{ value: EnvironmentTab; label: string }> = [
  { value: 'overview', label: 'Overview' },
  { value: 'scripts', label: 'Scripts' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'actions', label: 'Actions' },
  { value: 'logs', label: 'Logs' },
];

function toTab(value: string): EnvironmentTab {
  const found = TABS.find((entry) => entry.value === value);
  return found ? found.value : 'overview';
}

export function EnvironmentDetailPage({
  env,
  app,
  tab,
  onTabChange,
}: {
  env: WorkspaceEnvironment;
  app: DashboardApp;
  tab: EnvironmentTab;
  onTabChange: (tab: EnvironmentTab) => void;
}) {
  const devCommand = app.scripts.dev ?? Object.values(app.scripts)[0] ?? '';
  return (
    <Stack gap={4}>
      <Link href="/environments" isStandalone>
        ← Environments
      </Link>
      <HStack gap={3} align="center">
        <Heading level={1}>{env.name}</Heading>
        <StatusBadge status={env.status} />
      </HStack>
      <Text type="supporting">
        {env.type} · {env.project} · {env.region}
      </Text>
      <Text type="supporting">
        {env.branch} · {env.owner}
      </Text>
      <HStack gap={2} align="center">
        <Text type="supporting">TTL:</Text>
        <TTLIndicator ttl={env.ttl} />
        <Text type="supporting">Cost:</Text>
        <CostIndicator cost={env.cost} />
      </HStack>
      <HStack gap={3} align="center">
        <Link href={env.localUrl} isStandalone>
          Open locally
        </Link>
        <Link href={env.repository} isStandalone>
          View repository
        </Link>
      </HStack>
      <TabList value={tab} onChange={(value) => onTabChange(toTab(value))}>
        {TABS.map((entry) => (
          <Tab
            key={entry.value}
            value={entry.value}
            label={entry.label}
            href={
              entry.value === 'overview'
                ? `/environments/${env.id}`
                : `/environments/${env.id}?tab=${entry.value}`
            }
            onClick={(event) => {
              event.preventDefault();
              onTabChange(entry.value);
            }}
          />
        ))}
      </TabList>
      {tab === 'overview' && (
        <Stack gap={4}>
          <Stack gap={2}>
            <Heading level={2}>Health</Heading>
            <Text type="supporting">
              Local targets have no live health probe. The target is documented
              and stopped until you start it.
            </Text>
          </Stack>
          <Stack gap={2}>
            <Heading level={2}>Lifecycle</Heading>
            <Text type="supporting">
              No TTL is configured for local development targets.
            </Text>
          </Stack>
          <Stack gap={2}>
            <Heading level={2}>Start locally</Heading>
            <CodeBlock
              title={`Start ${env.project}`}
              language="bash"
              size="sm"
              code={devCommand}
            />
          </Stack>
          <Stack gap={2}>
            <Heading level={2}>Cost</Heading>
            <Text type="supporting">
              Cost tracking is not configured for local targets.
            </Text>
          </Stack>
        </Stack>
      )}
      {tab === 'scripts' && <AppScriptsSection app={app} />}
      {tab === 'infrastructure' && <AppInfrastructureSection app={app} />}
      {tab === 'actions' && <AppActionsSection app={app} />}
      {tab === 'logs' && (
        <EmptyState
          title="No live logs"
          description="Local targets stream no logs to this dashboard. Start the target locally to follow its output in your terminal."
        />
      )}
    </Stack>
  );
}
