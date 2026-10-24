import { CodeBlock } from '@astryxdesign/core/CodeBlock';
import { Heading } from '@astryxdesign/core/Heading';
import { Stack } from '@astryxdesign/core/Stack';

import type { DashboardApp } from '../dashboard/registry';

type AppScriptsSectionProps = { app: DashboardApp };

export function AppScriptsSection(props: AppScriptsSectionProps) {
  return (
    <Stack gap={3}>
      <Heading level={1}>Scripts</Heading>
      <CodeBlock
        title={`${props.app.name} scripts`}
        language="bash"
        size="sm"
        code={Object.entries(props.app.scripts)
          .map(([name, command]) => `# ${name}\n${command}`)
          .join('\n')}
      />
    </Stack>
  );
}
