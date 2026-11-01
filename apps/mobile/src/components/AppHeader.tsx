import brandSymbol from '../../../web/public/images/woodbrook-logo-128.webp';
import { LineIcon } from './LineIcon.js';
import type { Route } from '../features/content/contentModels.js';

type Props = { navigate: (route: Route) => void; compact?: boolean };

export function AppHeader(props: Props) {
  const compact = props.compact ?? false;
  const hostInset = lynx.__globalProps?.safeAreaTop;
  const topInset =
    typeof hostInset === 'number' &&
    Number.isFinite(hostInset) &&
    hostInset >= 0
      ? `${hostInset}px`
      : 'env(safe-area-inset-top, 0px)';
  return (
    <view className="app-header" style={{ paddingTop: topInset }}>
      <view className={`brand-row ${compact ? 'brand-row-compact' : ''}`}>
        <view
          className="brand-lockup"
          accessibility-element={true}
          accessibility-trait="button"
          accessibility-label="Woodbrook Residents home"
          bindtap={() => props.navigate({ name: 'home' })}
        >
          <image
            className="brand-mark"
            src={brandSymbol}
            mode="aspectFit"
            accessibility-element={false}
          />
          <view className="brand-copy">
            <text className="brand-name">Woodbrook Residents</text>
            {compact ? null : (
              <text className="brand-context">Community Hub</text>
            )}
          </view>
        </view>
        <view
          className="header-bell"
          accessibility-element={true}
          accessibility-trait="button"
          accessibility-label="View latest news"
          bindtap={() =>
            props.navigate({ name: 'collection', collection: 'updates' })
          }
        >
          <LineIcon name="news" />
        </view>
      </view>
    </view>
  );
}
