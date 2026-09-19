import { CalendarClock } from 'lucide-react';

export function EmptyState(props: { title: string; message: string }) {
  return (
    <div className="empty-state">
      <CalendarClock size={24} aria-hidden="true" />
      <h2>{props.title}</h2>
      <p>{props.message}</p>
    </div>
  );
}
