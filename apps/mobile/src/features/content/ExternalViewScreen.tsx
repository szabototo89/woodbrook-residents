import { domainOf } from './externalUrl.js';

type Props = {
  url: string;
  title: string;
  onBack: () => void;
};

/** In-app fallback when no external browser opener exists (iOS native). */
export function ExternalViewScreen(props: Props) {
  return (
    <scroll-view className="page" scroll-orientation="vertical">
      <text
        className="back-link"
        bindtap={props.onBack}
        accessibility-element={true}
        accessibility-trait="button"
        accessibility-label="Back"
      >
        Back
      </text>
      <view className="page-intro">
        <text className="eyebrow">{domainOf(props.url)}</text>
        <text className="page-title">{props.title}</text>
        <text className="page-copy">
          The official page could not be opened in a browser here, so it is
          shown below. Use the full link if you need to open it elsewhere.
        </text>
      </view>
      <view className="detail-body">
        <text className="fact-label">Official link</text>
        <text className="body-copy">{props.url}</text>
        <webview className="external-view" src={props.url} />
      </view>
    </scroll-view>
  );
}
