import { Search } from 'lucide-react';

export function SiteSearch(props: { compact?: boolean; query?: string }) {
  return (
    <form
      className={`site-search${props.compact ? ' site-search-compact' : ''}`}
      action="/search"
      method="get"
      role="search"
      aria-label={props.compact ? 'Header search' : 'Search Woodbrook'}
    >
      <Search size={21} aria-hidden="true" />
      <input
        type="search"
        name="q"
        aria-label="Search news, events and services"
        placeholder="Search news, events, services…"
        defaultValue={props.query}
        maxLength={120}
      />
      <button type="submit">Search</button>
    </form>
  );
}
