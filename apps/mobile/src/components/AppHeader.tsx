import type { Route } from '../features/content/contentModels.js';

type Props = { navigate: (route: Route) => void };

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
    </view>
  );
}
