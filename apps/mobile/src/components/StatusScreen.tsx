type Props = { failed: boolean; retry: () => void };

export function StatusScreen({ failed, retry }: Props) {
  return (
    <view className="status-screen">
      <text className="eyebrow">Woodbrook Residents</text>
      <text className="page-title">
        {failed
          ? 'Content is temporarily unavailable.'
          : 'Loading local information…'}
      </text>
      {failed ? (
        <text className="button" bindtap={retry}>
          Try again
        </text>
      ) : null}
    </view>
  );
}
