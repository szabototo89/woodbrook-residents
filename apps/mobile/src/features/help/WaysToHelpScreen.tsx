import type { ContentSnapshot } from '../content/contentTypes.js';

type Props = { content: ContentSnapshot };

export function WaysToHelpScreen({ content }: Props) {
  return (
    <scroll-view className="page" scroll-orientation="vertical">
      <view className="page-intro">
        <text className="eyebrow">Ways to help</text>
        <text className="page-title">How residents can contribute</text>
        <text className="page-copy">
          This is a read-only public resource. Public submissions are not
          available yet.
        </text>
      </view>
      <view className="card-list">
        <view className="content-card">
          <text className="card-title">Suggest a correction</text>
          <text className="card-copy">
            Spotted outdated or incomplete information? Use the community
            contact below.
          </text>
          {content.siteSetting?.contactEmail ? (
            <text className="source-url">
              {content.siteSetting.contactEmail}
            </text>
          ) : null}
        </view>
        <view className="content-card">
          <text className="card-title">Check upcoming events</text>
          <text className="card-copy">
            Confirm dates with the organiser before travelling.
          </text>
        </view>
        <view className="content-card">
          <text className="card-title">Follow local projects</text>
          <text className="card-copy">
            Use official sources to keep track of the next step.
          </text>
        </view>
      </view>
    </scroll-view>
  );
}
