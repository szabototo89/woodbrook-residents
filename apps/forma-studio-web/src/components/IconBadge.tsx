import type { LucideIcon } from 'lucide-react';

interface IconBadgeProps {
  variant: 'service' | 'guide';
  icon: LucideIcon;
}

export function IconBadge(props: IconBadgeProps) {
  const Icon = props.icon;
  const service = props.variant === 'service';
  return (
    <div className={service ? 'icon-circle' : 'guide-icon'} aria-hidden="true">
      <Icon
        size={service ? 31 : 30}
        strokeWidth={service ? 1.4 : 1.3}
        aria-hidden="true"
      />
    </div>
  );
}
