import { AppShell } from '@astryxdesign/core/AppShell';
import {
  SideNav,
  SideNavHeading,
  SideNavItem,
  SideNavSection,
} from '@astryxdesign/core/SideNav';
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { Boxes, Globe, LayoutDashboard, Wrench } from 'lucide-react';
import type { JSX } from 'react';

type NavPath = '/' | '/actions' | '/applications' | '/infrastructure';

const NAV_ITEMS: Array<{ label: string; path: NavPath; icon: JSX.Element }> = [
  { label: 'Overview', path: '/', icon: <LayoutDashboard size={16} /> },
  { label: 'Applications', path: '/applications', icon: <Boxes size={16} /> },
  {
    label: 'Infrastructure',
    path: '/infrastructure',
    icon: <Globe size={16} />,
  },
  { label: 'Build actions', path: '/actions', icon: <Wrench size={16} /> },
];

export function AdminShell() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AppShell
      height="auto"
      contentPadding={4}
      sideNav={
        <nav aria-label="Workspace">
          <SideNav
            collapsible
            header={<SideNavHeading heading="Woodbrook" headingHref="/" />}
          >
            <SideNavSection title="Workspace" isHeaderHidden>
              {NAV_ITEMS.map((item) => (
                <SideNavItem
                  key={item.path}
                  label={item.label}
                  icon={item.icon}
                  href={item.path}
                  isSelected={location.pathname === item.path}
                  onClick={(event) => {
                    event.preventDefault();
                    void navigate({ to: item.path });
                  }}
                />
              ))}
            </SideNavSection>
          </SideNav>
        </nav>
      }
    >
      <Outlet />
    </AppShell>
  );
}
