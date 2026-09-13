import type {
  CollectionKey,
  Route,
} from '../features/content/contentModels.js';

type Props = { navigate: (route: Route) => void };

const links: Array<{ label: string; collection: CollectionKey }> = [
  { label: 'Updates', collection: 'updates' },
  { label: 'Projects', collection: 'projects' },
  { label: 'Events', collection: 'events' },
  { label: 'Consultations', collection: 'surveys' },
  { label: 'Local information', collection: 'resources' },
];

export function AppHeader({ navigate }: Props) {
  return (
    <view className="app-header">
      <view className="brand-row" bindtap={() => navigate({ name: 'home' })}>
        <view className="brand-mark">
          <text className="brand-initial">W</text>
        </view>
        <view className="brand-copy">
          <text className="brand-name">Woodbrook Residents</text>
          <text className="brand-context">Community hub · Shankill</text>
        </view>
      </view>
      <scroll-view className="nav" scroll-orientation="horizontal">
        {links.map((link) => (
          <text
            className="nav-link"
            key={link.collection}
            bindtap={() =>
              navigate({ name: 'collection', collection: link.collection })
            }
          >
            {link.label}
          </text>
        ))}
        <text className="nav-link" bindtap={() => navigate({ name: 'help' })}>
          Ways to help
        </text>
      </scroll-view>
    </view>
  );
}
