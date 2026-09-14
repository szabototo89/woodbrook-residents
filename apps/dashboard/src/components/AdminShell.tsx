import { AppShell } from '@astryxdesign/core/AppShell';
import { Button } from '@astryxdesign/core/Button';
import {
  SideNav,
  SideNavHeading,
  SideNavItem,
  SideNavSection,
} from '@astryxdesign/core/SideNav';
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import {
  Activity,
  Boxes,
  FolderKanban,
  LayoutDashboard,
  LayoutTemplate,
  ListTree,
  SlidersHorizontal,
} from 'lucide-react';
import { useEffect, useState, type JSX } from 'react';

import { getWorkspaceEnvironments } from '../features/environments/environments';
import { apps } from '../features/dashboard/registry';
import { CommandMenu } from './CommandMenu';

const PRIMARY_ITEMS: Array<{ path: string; label: string; icon: JSX.Element }> =
  [
    {
      path: '/overview',
      label: 'Overview',
      icon: <LayoutDashboard size={16} />,
    },
    { path: '/environments', label: 'Environments', icon: <Boxes size={16} /> },
    {
      path: '/templates',
      label: 'Templates',
      icon: <LayoutTemplate size={16} />,
    },
    { path: '/projects', label: 'Projects', icon: <FolderKanban size={16} /> },
    { path: '/activity', label: 'Activity', icon: <Activity size={16} /> },
  ];

const WORKSPACE_ITEMS: Array<{
  path: string;
  label: string;
  icon: JSX.Element;
}> = [
  {
    path: '/infrastructure',
    label: 'Infrastructure',
    icon: <ListTree size={16} />,
  },
  { path: '/actions', label: 'Actions', icon: <SlidersHorizontal size={16} /> },
];

function isActive(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function AdminShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const environments = getWorkspaceEnvironments(apps);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsPaletteOpen((open) => !open);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  function goTo(path: string) {
    void navigate({ to: path });
  }

  function renderItem(item: {
    path: string;
    label: string;
    icon: JSX.Element;
  }) {
    return (
      <SideNavItem
        key={item.path}
        label={item.label}
        icon={item.icon}
        href={item.path}
        isSelected={isActive(location.pathname, item.path)}
        onClick={(event) => {
          event.preventDefault();
          goTo(item.path);
        }}
      />
    );
  }

  return (
    <AppShell
      height="auto"
      contentPadding={4}
      sideNav={
        <SideNav
          collapsible
          header={
            <SideNavHeading heading="Workspace" headingHref="/environments" />
          }
          topContent={
            <Button
              label="Search or jump to…  ⌘K"
              variant="secondary"
              width="100%"
              onClick={() => setIsPaletteOpen(true)}
            />
          }
        >
          <SideNavSection title="Sections" isHeaderHidden>
            {PRIMARY_ITEMS.map(renderItem)}
          </SideNavSection>
          <SideNavSection title="Workspace">
            {WORKSPACE_ITEMS.map(renderItem)}
          </SideNavSection>
        </SideNav>
      }
    >
      <Outlet />
      <CommandMenu
        isOpen={isPaletteOpen}
        onOpenChange={setIsPaletteOpen}
        environments={environments}
        onNavigate={goTo}
      />
    </AppShell>
  );
}
