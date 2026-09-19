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

type Tab = { key: TabKey; label: string; icon: string; target: Route };

const tabs: readonly Tab[] = [
  { key: 'home', label: 'Home', icon: '⌂', target: { name: 'home' } },
  {
    key: 'updates',
    label: 'Updates',
    icon: '◉',
    target: { name: 'collection', collection: 'updates' },
  },
  {
    key: 'events',
    label: 'Events',
    icon: '◫',
    target: { name: 'collection', collection: 'events' },
  },
  {
    key: 'local',
    label: 'Local',
    icon: '⌖',
    target: { name: 'collection', collection: 'resources' },
  },
  { key: 'more', label: 'More', icon: '•••', target: { name: 'more' } },
];

type Props = {
  route: Route;
  /** Switches top-level sections and resets any drill-in history. */
  navigateTab: (route: Route) => void;
};

export function TabBar(props: Props) {
  const current = topTabFor(props.route);
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
            bindtap={() => props.navigateTab(tab.target)}
          >
            <view className={`tab-pill ${selected ? 'tab-pill-active' : ''}`}>
              <text className={`tab-icon ${selected ? 'tab-icon-active' : ''}`}>
                {tab.icon}
              </text>
            </view>
            <text className={`tab-label ${selected ? 'tab-label-active' : ''}`}>
              {tab.label}
            </text>
            {selected ? <view className="tab-indicator" /> : null}
          </view>
        );
      })}
    </view>
  );
}
