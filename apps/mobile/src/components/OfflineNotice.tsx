type Props = { retry: () => void };

export function OfflineNotice(props: Props) {
  return (
    <view className="offline-notice">
      <text className="offline-copy">Content is temporarily unavailable.</text>
      <text className="button" bindtap={props.retry}>
        Try again
      </text>
    </view>
  );
}
