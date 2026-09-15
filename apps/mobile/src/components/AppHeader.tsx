import type { Route } from '../features/content/contentModels.js';

type Props = { navigate: (route: Route) => void; compact?: boolean };

export function AppHeader({ navigate, compact = false }: Props) {
  return (
    <view className="app-header">
      <view
        className={`brand-row ${compact ? 'brand-row-compact' : ''}`}
        bindtap={() => navigate({ name: 'home' })}
      >
        <view className="brand-mark">
          <text className="brand-initial">W</text>
        </view>
        <view className="brand-copy">
          <text className="brand-name">Woodbrook Residents</text>
          {compact ? null : (
            <text className="brand-context">Community hub · Shankill</text>
          )}
        </view>
      </view>
    </view>
  );
}
