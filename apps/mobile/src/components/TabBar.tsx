import type { Route } from '../features/content/contentModels.js';

export type TabKey = 'home' | 'updates' | 'events' | 'local' | 'more';

/** Maps any route to the top-level tab that represents it. */
export function topTabFor(route: Route): TabKey {
  if (route.name === 'home') return 'home';
  if (route.name === 'more' || route.name === 'help') return 'more';
  const section = route.collection;
  if (section === 'updates') return 'updates';
  if (section === 'events') return 'events';
  if (section === 'resources') return 'local';
  return 'more';
}

type Tab = { key: TabKey; label: string; target: Route };

const tabs: readonly Tab[] = [
  { key: 'home', label: 'Home', target: { name: 'home' } },
  {
    key: 'updates',
    label: 'Updates',
    target: { name: 'collection', collection: 'updates' },
  },
  {
    key: 'events',
    label: 'Events',
    target: { name: 'collection', collection: 'events' },
  },
  {
    key: 'local',
    label: 'Local',
    target: { name: 'collection', collection: 'resources' },
  },
  { key: 'more', label: 'More', target: { name: 'more' } },
];

type Props = {
  route: Route;
  /** Switches top-level sections and resets any drill-in history. */
  navigateTab: (route: Route) => void;
};

export function TabBar({ route, navigateTab }: Props) {
  const current = topTabFor(route);
  return (
    <view className="tab-bar">
      {tabs.map((tab) => {
        const selected = tab.key === current;
        return (
          <view
            className={`tab-item ${selected ? 'tab-item-active' : ''}`}
            key={tab.key}
            accessibility-element={true}
            accessibility-trait="button"
            accessibility-label={
              selected ? `${tab.label}, selected` : tab.label
            }
            bindtap={() => navigateTab(tab.target)}
          >
            <text className="tab-label">{tab.label}</text>
          </view>
        );
      })}
    </view>
  );
}
