import { ExternalLink } from '../../components/ExternalLink.js';
import type { Route } from '../content/contentModels.js';
import { openExternalUrl, type OpenUrl } from '../content/externalUrl.js';
import type { ContentSnapshot } from '../content/contentTypes.js';

type Props = {
  content: ContentSnapshot;
  navigate: (route: Route) => void;
  onOpenUrl?: OpenUrl;
};

export function WaysToHelpScreen({
  content,
  navigate,
  onOpenUrl = openExternalUrl,
}: Props) {
  return (
    <scroll-view className="page" scroll-orientation="vertical">
      <view className="page-intro">
        <text className="eyebrow">Ways to help</text>
        <text className="page-title">How residents can contribute</text>
        <text className="page-copy">
          Community contributions are coming soon.
        </text>
        <text className="page-copy">
          This is a read-only public resource for now. Public submissions are
          not available yet.
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
            <ExternalLink
              url={`mailto:${content.siteSetting.contactEmail}`}
              label={content.siteSetting.contactEmail}
              containerClassName="contact-link"
              labelClassName="contact-link-label"
              onOpenUrl={onOpenUrl}
            />
          ) : null}
        </view>
        <view
          className="content-card"
          accessibility-element={true}
          accessibility-trait="button"
          accessibility-label="Check upcoming events. Confirm dates with the organiser before travelling."
          bindtap={() => navigate({ name: 'collection', collection: 'events' })}
        >
          <text className="card-title">Check upcoming events</text>
          <text className="card-copy">
            Confirm dates with the organiser before travelling.
          </text>
          <text className="card-action">View events →</text>
        </view>
        <view
          className="content-card"
          accessibility-element={true}
          accessibility-trait="button"
          accessibility-label="Follow local projects. Use official sources to keep track of the next step."
          bindtap={() =>
            navigate({ name: 'collection', collection: 'projects' })
          }
        >
          <text className="card-title">Follow local projects</text>
          <text className="card-copy">
            Use official sources to keep track of the next step.
          </text>
          <text className="card-action">View projects →</text>
        </view>
        <view
          className="content-card"
          accessibility-element={true}
          accessibility-trait="button"
          accessibility-label="Respond to consultations. Current opportunities to respond and an archive of closed consultations."
          bindtap={() =>
            navigate({ name: 'collection', collection: 'surveys' })
          }
        >
          <text className="card-title">Respond to consultations</text>
          <text className="card-copy">
            Current opportunities to respond and an archive of closed
            consultations.
          </text>
          <text className="card-action">View consultations →</text>
        </view>
      </view>
    </scroll-view>
  );
}
