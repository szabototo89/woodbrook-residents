import type { Route } from '../content/contentModels.js';

type Props = { navigate: (route: Route) => void };

const rows: ReadonlyArray<{
  title: string;
  description: string;
  route: Route;
}> = [
  {
    title: 'Projects',
    description: 'What is proposed, active, completed, or being monitored.',
    route: { name: 'collection', collection: 'projects' },
  },
  {
    title: 'Consultations',
    description: 'Open chances to respond, plus closed records.',
    route: { name: 'collection', collection: 'surveys' },
  },
  {
    title: 'Ways to help',
    description: 'What residents can do now and what is coming soon.',
    route: { name: 'help' },
  },
];

export function MoreScreen({ navigate }: Props) {
  return (
    <scroll-view className="page" scroll-orientation="vertical">
      <view className="page-intro">
        <text className="page-title">More</text>
        <text className="page-copy">
          Projects, consultations, and ways to contribute.
        </text>
      </view>
      <view className="card-list">
        {rows.map((row) => (
          <view
            className="content-card"
            key={row.title}
            accessibility-element={true}
            accessibility-trait="button"
            accessibility-label={`${row.title}. ${row.description}`}
            bindtap={() => navigate(row.route)}
          >
            <text className="card-title">{row.title}</text>
            <text className="card-copy">{row.description}</text>
            <text className="card-action">Open →</text>
          </view>
        ))}
      </view>
    </scroll-view>
  );
}
