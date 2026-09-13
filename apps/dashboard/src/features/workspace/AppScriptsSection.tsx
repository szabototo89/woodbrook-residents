import { CodeBlock } from '@astryxdesign/core/CodeBlock';
import { Heading } from '@astryxdesign/core/Heading';
import { Stack } from '@astryxdesign/core/Stack';

import type { DashboardApp } from '../dashboard/registry';

export function AppScriptsSection({ app }: { app: DashboardApp }) {
  return (
    <Stack gap={3}>
      <Heading level={1}>Scripts</Heading>
      <CodeBlock
        title={`${app.name} scripts`}
        language="bash"
        size="sm"
        code={Object.entries(app.scripts)
          .map(([name, command]) => `# ${name}\n${command}`)
          .join('\n')}
      />
    </Stack>
  );
}
