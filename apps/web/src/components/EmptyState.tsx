import { CalendarClock, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  message: string;
  icon?: LucideIcon;
  children?: ReactNode;
};

export function EmptyState(props: EmptyStateProps) {
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
