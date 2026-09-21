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
export function ExternalLink(props: Props) {
  const containerClassName = props.containerClassName ?? 'external-link';
  const labelClassName = props.labelClassName ?? 'external-link-label';
  const detailClassName = props.detailClassName ?? 'external-link-detail';
  const onOpenUrl = props.onOpenUrl ?? openExternalUrl;
  return (
    <view
      className={containerClassName}
      bindtap={() => onOpenUrl(props.url)}
      accessibility-element={true}
      accessibility-trait="button"
      accessibility-label={
        props.detail ? `${props.label}. ${props.detail}` : props.label
      }
    >
      <text className={labelClassName}>{props.label}</text>
      {props.detail ? (
        <text className={detailClassName}>{props.detail}</text>
      ) : null}
    </view>
  );
}
