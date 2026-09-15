import {
  openExternalUrl,
  type OpenUrl,
} from '../features/content/externalUrl.js';

type Props = {
  url: string;
  label: string;
  detail?: string;
  containerClassName?: string;
  labelClassName?: string;
  detailClassName?: string;
  onOpenUrl?: OpenUrl;
};

/** A tappable external action with an accessible button label. */
export function ExternalLink({
  url,
  label,
  detail,
  containerClassName = 'external-link',
  labelClassName = 'external-link-label',
  detailClassName = 'external-link-detail',
  onOpenUrl = openExternalUrl,
}: Props) {
  return (
    <view
      className={containerClassName}
      bindtap={() => onOpenUrl(url)}
      accessibility-element={true}
      accessibility-trait="button"
      accessibility-label={detail ? `${label}. ${detail}` : label}
    >
      <text className={labelClassName}>{label}</text>
      {detail ? <text className={detailClassName}>{detail}</text> : null}
    </view>
  );
}
