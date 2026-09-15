export function StatusScreen() {
  return (
    <view className="status-screen">
      <text className="eyebrow">Woodbrook Residents</text>
      <text className="status-title">Loading local information…</text>
      <view className="skeleton-block">
        <view className="skeleton-line skeleton-line-wide" />
        <view className="skeleton-line" />
        <view className="skeleton-line skeleton-line-narrow" />
      </view>
    </view>
  );
}
