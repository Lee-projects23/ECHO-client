import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ActivityRowProps {
  icon: LucideIcon;
  title: string;
  detail: string;
  meta: string;
  status?: React.ReactNode;
  onClick: (() => void) | undefined;
  showMetaBtn?: boolean;
  onMetaClick?: () => void;
  className?: string;
}

export const ActivityRow: React.FC<ActivityRowProps> = ({
  icon: Icon,
  title,
  detail,
  meta,
  status,
  onClick,
  showMetaBtn,
  onMetaClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`group flex w-full cursor-pointer items-center gap-3.5 rounded-xl px-3 py-3 text-left transition-colors hover:bg-tray ${className}`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-tint transition-colors group-hover:border-accent/30 group-hover:text-accent ${
          onClick ? '' : 'cursor-default'
        }`}
      >
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-ink">{title}</div>
        <div className="truncate text-[11px] text-faint">{detail}</div>
      </div>
      {status && <div className="shrink-0">{status}</div>}
      <div className="shrink-0 text-right">
        {showMetaBtn && onMetaClick ? (
          <button
            onClick={e => {
              e.stopPropagation();
              onMetaClick();
            }}
            className="text-[11px] font-semibold uppercase tracking-wider text-accent hover:opacity-80"
          >
            {meta}
          </button>
        ) : (
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-faint">{meta}</span>
        )}
      </div>
    </div>
  );
};