import woodbrookImage from '../../../../web/public/images/woodbrook-coast-aerial-768.jpg';

import type { Route } from '../content/contentModels.js';
import { readableDate, readableDateTime } from '../content/contentModels.js';
import type { ContentSnapshot } from '../content/contentTypes.js';
import {
  browseTargets,
  latestUpdate,
  openConsultation,
  upcomingEvent,
} from './homeContent.js';

const imageDescription =
  'Aerial view across Woodbrook toward the coast, Bray and the Wicklow Mountains';

type Props = {
  content: ContentSnapshot;
  navigate?: (route: Route) => void;
};

const quickAccess: ReadonlyArray<{
  title: string;
  icon: string;
  description: string;
  route: Route;
}> = [
  {
    title: 'Updates',
    icon: '📰',
    description: 'Source-linked local changes',
    route: { name: 'collection', collection: 'updates' },
  },
  {
    title: 'Events',
    icon: '📅',
    description: 'Confirmed local dates',
    route: { name: 'collection', collection: 'events' },
  },
  {
    title: 'Local',
    icon: '📍',
    description: 'Nearby services and contacts',
    route: { name: 'collection', collection: 'resources' },
  },
  {
    title: 'More',
    icon: '•••',
    description: 'Projects, consultations and help',
    route: { name: 'more' },
  },
];

export function HomeScreen({ content, navigate = () => undefined }: Props) {
  const latest = latestUpdate(content);
  const upcoming = upcomingEvent(content);
  const consultation = openConsultation(content);

  return (
    <scroll-view className="screen" scroll-orientation="vertical">
      <view className="hero">
        <text className="hero-title">
          Local information and ways to take part.
        </text>
        <text className="hero-lede">
          Keep up with local changes, find practical information, and take part
          in community life.
        </text>
      </view>

      {latest ? (
        <view className="hero-wrap">
          <view
            className="hero-card"
            accessibility-element={true}
            accessibility-trait="button"
            accessibility-label={`Latest update. ${latest.title}`}
            bindtap={() =>
              navigate({
                name: 'detail',
                collection: 'updates',
                slug: latest.slug,
              })
            }
          >
            <image
              className="hero-card-image"
              src={woodbrookImage}
              mode="aspectFill"
              accessibility-element={true}
              accessibility-label={imageDescription}
            />
            <view className="hero-card-overlay">
              <view className="hero-pill">
                <text className="hero-pill-text">Latest update</text>
              </view>
              <view className="hero-card-bottom">
                <view className="hero-card-copy">
                  <text className="hero-card-title">{latest.title}</text>
                  <text className="hero-card-subtitle">{latest.summary}</text>
                </view>
                <view className="hero-go">
                  <text className="hero-go-arrow">›</text>
                </view>
              </view>
            </view>
          </view>
          <view className="hero-dots">
            <view className="hero-dot hero-dot-active" />
            <view className="hero-dot" />
            <view className="hero-dot" />
            <view className="hero-dot" />
            <view className="hero-dot" />
          </view>
          <text className="image-credit">
            Woodbrook and the Shankill coastline
          </text>
        </view>
      ) : (
        <view className="hero-wrap">
          <image
            className="hero-image"
            src={woodbrookImage}
            mode="aspectFill"
            accessibility-element={true}
            accessibility-label={imageDescription}
          />
          <text className="image-credit">
            Woodbrook and the Shankill coastline
          </text>
        </view>
      )}

      {upcoming ? (
        <view>
          <view className="section-header">
            <text className="section-title">Upcoming event</text>
            <text
              className="section-link"
              accessibility-element={true}
              accessibility-trait="button"
              accessibility-label="See all events"
              bindtap={() =>
                navigate({ name: 'collection', collection: 'events' })
              }
            >
              See all →
            </text>
          </view>
          <view
            className="upcoming-card"
            accessibility-element={true}
            accessibility-trait="button"
            accessibility-label={`Upcoming event. ${upcoming.title}`}
            bindtap={() =>
              navigate({
                name: 'detail',
                collection: 'events',
                slug: upcoming.slug,
              })
            }
          >
            <view className="upcoming-icon">
              <text className="upcoming-icon-text">📅</text>
            </view>
            <view className="upcoming-copy">
              <text className="card-meta">{`${readableDate(upcoming.startsAt)}, ${readableDateTime(upcoming.startsAt).split(',')[1]?.trim() ?? ''}`}</text>
              <text className="upcoming-title">{upcoming.title}</text>
              <text className="upcoming-location">📍 {upcoming.location}</text>
            </view>
            <view className="chevron-circle">
              <text className="chevron-text">›</text>
            </view>
          </view>
          <text
            className="home-view-all"
            accessibility-element={true}
            accessibility-trait="button"
            accessibility-label="View all events"
            bindtap={() =>
              navigate({ name: 'collection', collection: 'events' })
            }
          >
            View all events →
          </text>
        </view>
      ) : null}

      <view>
        <text className="section-title quick-title">Quick access</text>
        <view className="quick-grid">
          {quickAccess.map((item) => (
            <view
              className="quick-item"
              key={item.title}
              accessibility-element={true}
              accessibility-trait="button"
              accessibility-label={`${item.title}. ${item.description}`}
              bindtap={() => navigate(item.route)}
            >
              <view className="quick-icon">
                <text className="quick-icon-text">{item.icon}</text>
              </view>
              <text className="quick-label">{item.title}</text>
            </view>
          ))}
        </view>
      </view>

      <view>
        <view
          className="home-section"
          accessibility-element={true}
          accessibility-trait="button"
          accessibility-label="Nearby essentials. Find GPs, schools, pharmacies, and transport."
          bindtap={() =>
            navigate({ name: 'collection', collection: 'resources' })
          }
        >
          <view className="home-section-copy">
            <text className="eyebrow">Nearby</text>
            <text className="home-item-title">Find nearby essentials</text>
            <text className="card-meta">
              GPs, schools, pharmacies, and transport
            </text>
          </view>
          <text className="home-chevron">›</text>
        </view>
      </view>

      {consultation ? (
        <view>
          <view
            className="home-section"
            accessibility-element={true}
            accessibility-trait="button"
            accessibility-label={`Have your say. ${consultation.title}`}
            bindtap={() =>
              navigate({
                name: 'detail',
                collection: 'surveys',
                slug: consultation.slug,
              })
            }
          >
            <view className="home-section-copy">
              <text className="eyebrow">Have your say</text>
              <text className="home-item-title">{consultation.title}</text>
              <text className="card-meta">
                {consultation.closesOn
                  ? `Closes ${readableDate(consultation.closesOn)}`
                  : consultation.stage}
              </text>
            </view>
            <text className="home-chevron">›</text>
          </view>
          <text
            className="home-view-all"
            accessibility-element={true}
            accessibility-trait="button"
            accessibility-label="View all consultations"
            bindtap={() =>
              navigate({ name: 'collection', collection: 'surveys' })
            }
          >
            View all consultations →
          </text>
        </view>
      ) : null}

      <view className="home-browse">
        <text className="section-title">Browse all sections</text>
        {browseTargets.map((target) => (
          <view
            className="browse-row"
            key={target.title}
            accessibility-element={true}
            accessibility-trait="button"
            accessibility-label={`${target.title}. ${target.description}`}
            bindtap={() => navigate(target.route)}
          >
            <text className="browse-title">{target.title}</text>
            <text className="browse-arrow">→</text>
          </view>
        ))}
      </view>

      <view
        className="contribution"
        accessibility-element={true}
        accessibility-trait="button"
        accessibility-label="Ways to help. Help keep local information useful."
        bindtap={() => navigate({ name: 'help' })}
      >
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
