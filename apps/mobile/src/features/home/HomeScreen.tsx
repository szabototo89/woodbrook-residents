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
        <image
          className="hero-image"
          src={woodbrookImage}
          mode="aspectFill"
          accessibility-element={true}
          accessibility-label={imageDescription}
        />
        <text className="image-credit">Image: Woodbrook Shankill</text>
      </view>

      {latest ? (
        <view
          className="home-section"
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
          <text className="eyebrow">Latest</text>
          <text className="home-item-title">{latest.title}</text>
          <text className="card-meta">{`${latest.kind} · ${readableDate(latest.publishedOn)}`}</text>
        </view>
      ) : null}

      {upcoming ? (
        <view
          className="home-section"
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
          <text className="eyebrow">Upcoming</text>
          <text className="home-item-title">{upcoming.title}</text>
          <text className="card-meta">{`${readableDateTime(upcoming.startsAt)} · ${upcoming.location}`}</text>
        </view>
      ) : null}

      <view
        className="home-section"
        accessibility-element={true}
        accessibility-trait="button"
        accessibility-label="Nearby essentials. Find GPs, schools, pharmacies, and transport."
        bindtap={() =>
          navigate({ name: 'collection', collection: 'resources' })
        }
      >
        <text className="eyebrow">Nearby</text>
        <text className="home-item-title">Find nearby essentials</text>
        <text className="card-meta">
          GPs, schools, pharmacies, and transport
        </text>
      </view>

      {consultation ? (
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
          <text className="eyebrow">Have your say</text>
          <text className="home-item-title">{consultation.title}</text>
          <text className="card-meta">
            {consultation.closesOn
              ? `Closes ${readableDate(consultation.closesOn)}`
              : consultation.stage}
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
