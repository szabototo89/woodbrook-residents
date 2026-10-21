import {
  ArrowRight,
  ArrowUpDown,
  Ban,
  CalendarDays,
  CircleCheck,
  CircleHelp,
  Clock3,
  FolderOpen,
  Search,
  SearchX,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { handoffs } from './handoffs';

type Handoff = (typeof handoffs)[number];
type RangeKey = (typeof RANGES)[number]['key'];
type SortKey = (typeof SORTS)[number]['key'];

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const DAY = 86_400_000;
const RANGES = [
  { key: 'all', label: 'All', days: null },
  { key: '7d', label: '7 days', days: 7 },
  { key: '30d', label: '30 days', days: 30 },
  { key: '90d', label: '90 days', days: 90 },
] as const;
const SORTS = [
  { key: 'newest', label: 'Newest first' },
  { key: 'oldest', label: 'Oldest first' },
  { key: 'title', label: 'Title A–Z' },
] as const;
const STATUS_ICONS: Record<string, LucideIcon> = {
  complete: CircleCheck,
  blocked: Ban,
  'in-progress': Clock3,
  'ready-for-review': Clock3,
};

function timestamp(value?: string) {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatUpdatedAt(value?: string) {
  const parsed = timestamp(value);
  if (parsed === null) return null;
  const date = new Date(parsed);
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}, ${hours}:${minutes} UTC`;
}

function statusBadge(status?: string) {
  const label = status?.trim();
  if (!label) return null;
  const modifier = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return {
    label: label.charAt(0).toUpperCase() + label.slice(1),
    modifier,
    Icon: STATUS_ICONS[modifier] ?? CircleHelp,
  };
}

function sortDocuments(documents: readonly Handoff[], sort: SortKey) {
  return [...documents].sort((left, right) => {
    if (sort === 'title') return left.title.localeCompare(right.title);
    const undatedRank = sort === 'newest' ? -Infinity : Infinity;
    const leftRank = timestamp(left.updatedAt) ?? undatedRank;
    const rightRank = timestamp(right.updatedAt) ?? undatedRank;
    if (leftRank === rightRank) return left.title.localeCompare(right.title);
    return sort === 'newest' ? rightRank - leftRank : leftRank - rightRank;
  });
}

function matchesQuery(handoff: Handoff, query: string) {
  return [handoff.title, handoff.summary, handoff.status]
    .join(' ')
    .toLowerCase()
    .includes(query);
}

export function HandoffsPage(props: { documents?: typeof handoffs }) {
  const [query, setQuery] = useState('');
  const [range, setRange] = useState<RangeKey>('all');
  const [sort, setSort] = useState<SortKey>('newest');
  const inputRef = useRef<HTMLInputElement>(null);
  const documents = props.documents ?? handoffs;
  const normalizedQuery = query.trim().toLowerCase();
  const activeRange = RANGES.find((option) => option.key === range)!;
  const cutoff =
    activeRange.days === null ? null : Date.now() - activeRange.days * DAY;
  const visibleDocuments = sortDocuments(
    documents.filter(
      (handoff) =>
        (cutoff === null ||
          (timestamp(handoff.updatedAt) ?? -Infinity) >= cutoff) &&
        (!normalizedQuery || matchesQuery(handoff, normalizedQuery)),
    ),
    sort,
  );
  const filtersActive = Boolean(normalizedQuery) || range !== 'all';
  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };
  const showAll = () => {
    setQuery('');
    setRange('all');
    inputRef.current?.focus();
  };
  const changeSort = (value: string) => {
    const option = SORTS.find((item) => item.key === value);
    if (option) setSort(option.key);
  };
  return (
    <main id="main-content" className="handoffs-page shell">
      <div className="handoffs-layout">
        <header className="handoffs-intro">
          <p className="eyebrow">Repository notebook</p>
          <h1>Agent handoffs</h1>
          <p className="handoffs-lede">
            Context, decisions, architecture, and evidence for the next agent.
          </p>
          {documents.length > 0 ? (
            <>
              <div className="handoff-search" role="search">
                <label className="visually-hidden" htmlFor="handoff-search">
                  Search handoffs
                </label>
                <Search
                  className="handoff-search-icon"
                  size={16}
                  aria-hidden="true"
                />
                <input
                  ref={inputRef}
                  id="handoff-search"
                  type="search"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="Search handoffs"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape' && query) {
                      event.preventDefault();
                      clearSearch();
                    }
                  }}
                />
                {query ? (
                  <button
                    type="button"
                    className="handoff-search-clear"
                    aria-label="Clear search"
                    onClick={clearSearch}
                  >
                    <X size={15} aria-hidden="true" />
                  </button>
                ) : null}
              </div>
              <p className="handoff-filter-label" id="handoff-range-label">
                <CalendarDays size={13} aria-hidden="true" />
                Updated
              </p>
              <div
                className="handoff-range"
                role="group"
                aria-labelledby="handoff-range-label"
              >
                {RANGES.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    aria-pressed={range === option.key}
                    onClick={() => setRange(option.key)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="handoff-sort">
                <label className="handoff-filter-label" htmlFor="handoff-sort">
                  <ArrowUpDown size={13} aria-hidden="true" />
                  Sort
                </label>
                <select
                  id="handoff-sort"
                  value={sort}
                  onChange={(event) => changeSort(event.target.value)}
                >
                  {SORTS.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="handoffs-count" aria-live="polite">
                {filtersActive ? (
                  <>
                    {visibleDocuments.length} of {documents.length}{' '}
                    {documents.length === 1 ? 'handoff' : 'handoffs'}
                  </>
                ) : (
                  <>
                    {documents.length}{' '}
                    {documents.length === 1 ? 'handoff' : 'handoffs'}
                  </>
                )}
              </p>
            </>
          ) : null}
        </header>
        <section aria-label="Handoff documents" className="handoff-index">
          {documents.length === 0 ? (
            <div className="handoff-empty" role="status">
              <FolderOpen
                className="handoff-empty-icon"
                size={20}
                aria-hidden="true"
              />
              <h2>No handoffs yet</h2>
              <p>
                Add <code>docs/handoffs/&lt;feature-slug&gt;/index.mdx</code> to
                start the notebook.
              </p>
            </div>
          ) : visibleDocuments.length === 0 ? (
            <div className="handoff-empty">
              <SearchX
                className="handoff-empty-icon"
                size={20}
                aria-hidden="true"
              />
              <h2>
                {normalizedQuery
                  ? 'No matching handoffs'
                  : 'No recent handoffs'}
              </h2>
              <p>
                {normalizedQuery
                  ? `Nothing matches “${query.trim()}”${
                      range === 'all' ? '' : ` in the last ${activeRange.label}`
                    }. Try a feature name, status, or summary.`
                  : `No handoffs were updated in the last ${activeRange.label}. Choose a wider time range or show all handoffs.`}
              </p>
              <button type="button" onClick={showAll}>
                Show all handoffs
              </button>
            </div>
          ) : (
            <ul className="handoff-list">
              {visibleDocuments.map((handoff) => {
                const badge = statusBadge(handoff.status);
                const updated = formatUpdatedAt(handoff.updatedAt);
                const StatusIcon = badge?.Icon;
                return (
                  <li key={handoff.slug}>
                    <a
                      className="handoff-card"
                      href={`#/${handoff.slug}`}
                      aria-label={`${handoff.title} — open handoff`}
                    >
                      <div className="handoff-card-top">
                        {badge && StatusIcon ? (
                          <span
                            className={`handoff-status handoff-status--${badge.modifier}`}
                          >
                            <StatusIcon size={12} aria-hidden="true" />
                            {badge.label}
                          </span>
                        ) : null}
                        {updated ? (
                          <span className="handoff-updated">
                            Updated{' '}
                            <time dateTime={handoff.updatedAt}>{updated}</time>
                          </span>
                        ) : (
                          <span className="handoff-updated">
                            Update not recorded
                          </span>
                        )}
                      </div>
                      <h2>{handoff.title}</h2>
                      <p className="handoff-card-summary">{handoff.summary}</p>
                      <span className="handoff-card-action">
                        Open handoff <ArrowRight size={15} aria-hidden="true" />
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
