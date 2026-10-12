import { CalendarClock, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export function EmptyState(props: {
  title: string;
  message: string;
  icon?: LucideIcon;
  children?: ReactNode;
}) {
  const Icon = props.icon ?? CalendarClock;
  return (
    <div className="empty-state">
      <Icon size={24} aria-hidden="true" />
      <h2>{props.title}</h2>
      <p>{props.message}</p>
      {props.children}
    </div>
  );
}
