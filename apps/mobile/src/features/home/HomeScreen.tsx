import woodbrookImage from '../../../../web/public/images/woodbrook-coast-aerial-light-768.webp';
import { LineIcon, type IconName } from '../../components/LineIcon.js';

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
  icon: IconName;
  description: string;
  route: Route;
}> = [
  {
    title: 'Updates',
    icon: 'news',
    description: 'Source-linked local changes',
    route: { name: 'collection', collection: 'updates' },
  },
  {
    title: 'Events',
    icon: 'calendar',
    description: 'Confirmed local dates',
    route: { name: 'collection', collection: 'events' },
  },
  {
    title: 'Local',
    icon: 'pin',
    description: 'Nearby services and contacts',
    route: { name: 'collection', collection: 'resources' },
  },
  {
    title: 'More',
    icon: 'more',
    description: 'Projects, consultations and help',
    route: { name: 'more' },
  },
];

export function HomeScreen(props: Props) {
  const navigate = props.navigate ?? (() => undefined);
  const latest = latestUpdate(props.content);
  const upcoming = upcomingEvent(props.content);
  const consultation = openConsultation(props.content);

  return (
    <scroll-view className="screen" scroll-orientation="vertical">
      <view className="hero">
        <image
          className="coastal-image"
          src={woodbrookImage}
          mode="aspectFill"
          accessibility-element={true}
          accessibility-label={imageDescription}
        />
        <view className="coastal-wash" />
        <view className="location-pill">
          <text className="location-pill-text">Shankill, Dublin</text>
        </view>
        <text className="hero-title">
          Find what’s happening in Woodbrook, fast.
        </text>
        <text className="hero-lede">
          Local news, events, projects and practical information for Woodbrook
          and nearby Shankill.
        </text>
      </view>

      <text className="image-credit home-image-credit">
        Woodbrook and the Shankill coastline
      </text>

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
                <LineIcon name={item.icon} />
              </view>
              <text className="quick-label">{item.title}</text>
              <text className="quick-chevron">›</text>
            </view>
          ))}
        </view>
      </view>

      {latest ? (
        <view className="home-news-panel">
          <view className="section-header">
            <text className="section-title">What’s new in Woodbrook</text>
          </view>
          <view
            className="home-news-story"
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
            <text className="eyebrow">Latest update</text>
            <text className="home-item-title">{latest.title}</text>
            <text className="card-copy">{latest.summary}</text>
            <text className="card-meta">
              {latest.sourceName} · {readableDate(latest.publishedOn)}
            </text>
            <text className="card-action">Read the story →</text>
          </view>
          <text
            className="home-view-all"
            accessibility-element={true}
            accessibility-trait="button"
            accessibility-label="View all news"
            bindtap={() =>
              navigate({ name: 'collection', collection: 'updates' })
            }
          >
            View all news →
          </text>
        </view>
      ) : null}

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
              <LineIcon name="calendar" />
            </view>
            <view className="upcoming-copy">
              <text className="card-meta">{`${readableDate(upcoming.startsAt)}, ${readableDateTime(upcoming.startsAt).split(',')[1]?.trim() ?? ''}`}</text>
              <text className="upcoming-title">{upcoming.title}</text>
              <text className="upcoming-location">{upcoming.location}</text>
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
