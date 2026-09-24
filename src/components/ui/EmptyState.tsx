import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    className?: string;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center px-6 py-16 text-center anim-fade ${className}`}
    >
      {Icon && (
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-line text-faint">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      )}
      <h3 className="text-xl font-medium tracking-[-0.02em] text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm leading-relaxed text-faint">{description}</p>}
      {action && (
        <button onClick={action.onClick} className={`btn-secondary mt-6 ${action.className || ''}`}>
          {action.label}
        </button>
      )}
    </div>
  );
};