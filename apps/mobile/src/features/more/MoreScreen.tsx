import type { Route } from '../content/contentModels.js';

type Props = { navigate: (route: Route) => void };

const rows: ReadonlyArray<{
  title: string;
  description: string;
  route: Route;
}> = [
  {
    title: 'Projects',
    description: 'Proposed, active and monitored projects.',
    route: { name: 'collection', collection: 'projects' },
  },
  {
    title: 'Consultations',
    description: 'Open opportunities and previous consultations.',
    route: { name: 'collection', collection: 'surveys' },
  },
  {
    title: 'Ways to help',
    description: 'How residents can contribute.',
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
      <view className="more-list">
        {rows.map((row) => (
          <view
            className="browse-row more-row"
            key={row.title}
            accessibility-element={true}
            accessibility-trait="button"
            accessibility-label={`${row.title}. ${row.description}`}
            bindtap={() => navigate(row.route)}
          >
            <view className="list-row-copy">
              <text className="browse-title">{row.title}</text>
              <text className="card-meta">{row.description}</text>
            </view>
            <text className="browse-arrow">›</text>
          </view>
        ))}
      </view>
      <view className="scroll-spacer" />
    </scroll-view>
  );
}
