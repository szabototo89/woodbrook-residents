import woodbrookImage from '../../../../web/public/images/woodbrook-coast-aerial-768.jpg';

import { homeActions } from './homeContent.js';

const imageDescription =
  'Aerial view across Woodbrook toward the coast, Bray and the Wicklow Mountains';

export function HomeScreen() {
  return (
    <scroll-view className="screen" scroll-orientation="vertical">
      <view className="header">
        <view className="brand-mark" accessibility-element={true}>
          <text className="brand-initial">W</text>
        </view>
        <view className="brand-copy">
          <text className="brand-name">Woodbrook Residents</text>
          <text className="brand-context">Community hub · Shankill</text>
        </view>
      </view>

      <view className="hero">
        <text className="eyebrow">For Woodbrook residents</text>
        <text className="hero-title">
          Local information and ways to take part.
        </text>
        <text className="hero-lede">
          Keep up with local changes, find practical information, and take part
          in community life.
        </text>
        <text className="hero-intro">
          Browse updates, services, events, projects, and public consultations
          for Woodbrook and nearby Shankill.
        </text>
        <image
          className="hero-image"
          src={woodbrookImage}
          mode="aspectFill"
          accessibility-element={true}
          accessibility-label={imageDescription}
        />
        <text className="image-credit">Image: Woodbrook Shankill</text>
      </view>

      <view className="directory">
        <text className="eyebrow">Start here</text>
        <text className="section-title">What would you like to do?</text>
        <text className="section-intro">
          Choose a section based on the task you want to complete.
        </text>

        <view className="action-list">
          {homeActions.map((action, index) => (
            <view
              className={`action-card action-card-${index + 1}`}
              key={action.destination}
              accessibility-element={true}
              accessibility-trait="button"
              accessibility-label={`${action.title}. ${action.description}`}
            >
              <text className="action-eyebrow">{action.eyebrow}</text>
              <text className="action-title">{action.title}</text>
              <text className="action-description">{action.description}</text>
              <text className="action-link">Explore →</text>
            </view>
          ))}
        </view>
      </view>

      <view className="contribution">
        <text className="eyebrow eyebrow-light">Ways to help</text>
        <text className="contribution-title">
          Help keep local information useful.
        </text>
        <text className="contribution-copy">
          See what residents can do now, what is still being set up, and where
          to find official help.
        </text>
        <text className="contribution-action">See ways to help →</text>
      </view>

      <view className="footer">
        <text className="footer-title">Woodbrook Residents</text>
        <text className="footer-copy">
          Local information and practical ways to take part in Woodbrook and
          nearby Shankill.
        </text>
      </view>
    </scroll-view>
  );
}
