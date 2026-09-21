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

export function EnvironmentDetailPage(props: {
  env: WorkspaceEnvironment;
  app: DashboardApp;
  tab: EnvironmentTab;
  onTabChange: (tab: EnvironmentTab) => void;
}) {
  const devCommand =
    props.app.scripts.dev ?? Object.values(props.app.scripts)[0] ?? '';
  return (
    <Stack gap={4}>
      <Link href="/environments" isStandalone>
        ← Environments
      </Link>
      <HStack gap={3} align="center">
        <Heading level={1}>{props.env.name}</Heading>
        <StatusBadge status={props.env.status} />
      </HStack>
      <Text type="supporting">
        {props.env.type} · {props.env.project} · {props.env.region}
      </Text>
      <Text type="supporting">
        {props.env.branch} · {props.env.owner}
      </Text>
      <HStack gap={2} align="center">
        <Text type="supporting">TTL:</Text>
        <TTLIndicator ttl={props.env.ttl} />
        <Text type="supporting">Cost:</Text>
        <CostIndicator cost={props.env.cost} />
      </HStack>
      <HStack gap={3} align="center">
        <Link href={props.env.localUrl} isStandalone>
          Open locally
        </Link>
        <Link href={props.env.repository} isStandalone>
          View repository
        </Link>
      </HStack>
      <TabList
        value={props.tab}
        onChange={(value) => props.onTabChange(toTab(value))}
      >
        {TABS.map((entry) => (
          <Tab
            key={entry.value}
            value={entry.value}
            label={entry.label}
            href={
              entry.value === 'overview'
                ? `/environments/${props.env.id}`
                : `/environments/${props.env.id}?tab=${entry.value}`
            }
            onClick={(event) => {
              event.preventDefault();
              props.onTabChange(entry.value);
            }}
          />
        ))}
      </TabList>
      {props.tab === 'overview' && (
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
              title={`Start ${props.env.project}`}
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
      {props.tab === 'scripts' && <AppScriptsSection app={props.app} />}
      {props.tab === 'infrastructure' && (
        <AppInfrastructureSection app={props.app} />
      )}
      {props.tab === 'actions' && <AppActionsSection app={props.app} />}
      {props.tab === 'logs' && (
        <EmptyState
          title="No live logs"
          description="Local targets stream no logs to this dashboard. Start the target locally to follow its output in your terminal."
        />
      )}
    </Stack>
  );
}
