import type { Route } from '../features/content/contentModels.js';

type Props = { navigate: (route: Route) => void; compact?: boolean };

export function AppHeader({ navigate, compact = false }: Props) {
  return (
    <view className="app-header">
      <view className={`brand-row ${compact ? 'brand-row-compact' : ''}`}>
        <view
          className="brand-lockup"
          accessibility-element={true}
          accessibility-trait="button"
          accessibility-label="Woodbrook Residents home"
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
        <view
          className="header-bell"
          accessibility-element={true}
          accessibility-trait="button"
          accessibility-label="Notifications, view updates"
          bindtap={() =>
            navigate({ name: 'collection', collection: 'updates' })
          }
        >
          <text className="header-bell-icon">🔔</text>
        </view>
      </view>
    </view>
  );
}
