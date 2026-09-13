import { AppShell } from '@astryxdesign/core/AppShell';
import {
  SideNav,
  SideNavHeading,
  SideNavItem,
  SideNavSection,
} from '@astryxdesign/core/SideNav';
import { Outlet, useNavigate, useParams } from '@tanstack/react-router';
import { Boxes, Globe, LayoutDashboard } from 'lucide-react';
import type { JSX } from 'react';

import { apps } from '../features/dashboard/registry';

const APP_ICONS: Record<string, JSX.Element> = {
  web: <LayoutDashboard size={16} />,
  cms: <Boxes size={16} />,
  dashboard: <Globe size={16} />,
};

export function AdminShell() {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const activeApp =
    typeof params.appName === 'string' ? params.appName : undefined;

  return (
    <AppShell
      height="auto"
      contentPadding={4}
      sideNav={
        <SideNav
          collapsible
          header={<SideNavHeading heading="Workspace" headingHref="/" />}
        >
          <SideNavSection title="Applications" isHeaderHidden>
            {apps.map((app) => (
              <SideNavItem
                key={app.name}
                label={app.name}
                icon={APP_ICONS[app.name]}
                href={`/app/${app.name}`}
                isSelected={activeApp === app.name}
                onClick={(event) => {
                  event.preventDefault();
                  void navigate({
                    to: '/app/$appName',
                    params: { appName: app.name },
                  });
                }}
              />
            ))}
          </SideNavSection>
        </SideNav>
      }
    >
      <Outlet />
    </AppShell>
  );
}
