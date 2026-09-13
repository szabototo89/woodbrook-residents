import { AppShell } from '@astryxdesign/core/AppShell';
import { Selector } from '@astryxdesign/core/Selector';
import {
  SideNav,
  SideNavHeading,
  SideNavItem,
  SideNavSection,
} from '@astryxdesign/core/SideNav';
import {
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { Globe, ListTree, ScrollText, SlidersHorizontal } from 'lucide-react';
import { useEffect, type JSX } from 'react';

import type { AppSection } from '../features/dashboard/appFocus';
import {
  getSectionFromPath,
  persistSelectedApp,
} from '../features/dashboard/appFocus';
import { apps } from '../features/dashboard/registry';

const SECTION_ITEMS: Array<{
  section: AppSection;
  label: string;
  icon: JSX.Element;
}> = [
  { section: 'overview', label: 'Overview', icon: <Globe size={16} /> },
  { section: 'scripts', label: 'Scripts', icon: <ScrollText size={16} /> },
  {
    section: 'infrastructure',
    label: 'Infrastructure',
    icon: <ListTree size={16} />,
  },
  {
    section: 'actions',
    label: 'Actions',
    icon: <SlidersHorizontal size={16} />,
  },
];

export function AdminShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const activeApp = typeof params.appName === 'string' ? params.appName : 'web';
  const activeSection = getSectionFromPath(location.pathname);

  useEffect(() => {
    if (apps.some((app) => app.name === activeApp)) {
      persistSelectedApp(activeApp);
    }
  }, [activeApp]);

  function goToSection(appName: string, section: AppSection) {
    if (section === 'overview') {
      void navigate({ to: '/app/$appName', params: { appName } });
      return;
    }
    void navigate({
      to: '/app/$appName/$section',
      params: { appName, section },
    });
  }

  return (
    <AppShell
      height="auto"
      contentPadding={4}
      sideNav={
        <SideNav
          collapsible
          header={<SideNavHeading heading="Workspace" headingHref="/" />}
          topContent={
            <Selector
              label="Application"
              options={apps.map((app) => ({
                value: app.name,
                label: app.name,
                description: app.localUrl,
              }))}
              value={activeApp}
              onChange={(value) => goToSection(value, activeSection)}
              presentation="adaptive"
            />
          }
        >
          <SideNavSection title="Sections" isHeaderHidden>
            {SECTION_ITEMS.map((item) => {
              const path =
                item.section === 'overview'
                  ? `/app/${activeApp}`
                  : `/app/${activeApp}/${item.section}`;
              return (
                <SideNavItem
                  key={item.section}
                  label={item.label}
                  icon={item.icon}
                  href={path}
                  isSelected={activeSection === item.section}
                  onClick={(event) => {
                    event.preventDefault();
                    goToSection(activeApp, item.section);
                  }}
                />
              );
            })}
          </SideNavSection>
        </SideNav>
      }
    >
      <Outlet />
    </AppShell>
  );
}
