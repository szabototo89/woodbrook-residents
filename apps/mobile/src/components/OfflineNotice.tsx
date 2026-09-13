type Props = { retry: () => void };

export function OfflineNotice({ retry }: Props) {
  return (
    <view className="offline-notice">
      <text className="offline-copy">Content is temporarily unavailable.</text>
      <text className="button" bindtap={retry}>
        Try again
      </text>
    </view>
  );
}
