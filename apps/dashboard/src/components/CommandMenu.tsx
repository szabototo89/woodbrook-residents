import { CommandPalette } from '@astryxdesign/core/CommandPalette';
import { createStaticSource } from '@astryxdesign/core/Typeahead';
import { useMemo } from 'react';

import type { WorkspaceEnvironment } from '../features/environments/environments';

interface CommandItem {
  id: string;
  label: string;
  auxiliaryData: { group: string; href: string };
}

const PAGES: Array<{ page: string; label: string }> = [
  { page: 'overview', label: 'Go to overview' },
  { page: 'environments', label: 'Go to environments' },
  { page: 'templates', label: 'Go to templates' },
  { page: 'projects', label: 'Go to projects' },
  { page: 'activity', label: 'Go to activity' },
  { page: 'infrastructure', label: 'Go to infrastructure' },
  { page: 'actions', label: 'Go to actions' },
];

export function CommandMenu(props: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  environments: WorkspaceEnvironment[];
  onNavigate: (href: string) => void;
}) {
  const { searchSource, hrefById } = useMemo(() => {
    const items: CommandItem[] = [
      ...props.environments.map((env) => ({
        id: `env-${env.id}`,
        label: `Open ${env.name}`,
        auxiliaryData: {
          group: 'Environments',
          href: `/environments/${env.id}`,
        },
      })),
      ...PAGES.map(({ page, label }) => ({
        id: `page-${page}`,
        label,
        auxiliaryData: { group: 'Pages', href: `/${page}` },
      })),
    ];
    return {
      searchSource: createStaticSource<CommandItem>(items, {
        keywords: (item) => [item.auxiliaryData.href],
      }),
      hrefById: new Map(
        items.map((item) => [item.id, item.auxiliaryData.href]),
      ),
    };
  }, [props.environments]);

  return (
    <CommandPalette
      isOpen={props.isOpen}
      onOpenChange={props.onOpenChange}
      searchSource={searchSource}
      label="Command palette"
      onValueChange={(value) => {
        const href = hrefById.get(value);
        if (!href) return;
        props.onOpenChange(false);
        props.onNavigate(href);
      }}
    />
  );
}
