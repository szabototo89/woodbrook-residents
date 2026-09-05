import { CalendarClock } from 'lucide-react';

export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="empty-state">
      <CalendarClock size={24} aria-hidden="true" />
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
}
