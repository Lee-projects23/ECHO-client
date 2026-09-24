import React from 'react';
import { Wrench } from 'lucide-react';

interface MaintenanceRowProps {
  id: string;
  title: string;
  category: string;
  priority: string;
  status: React.ReactNode;
  cost: string;
  meta: string;
  onClick: () => void;
  className?: string;
}

export const MaintenanceRow: React.FC<MaintenanceRowProps> = ({
  id,
  title,
  category,
  priority,
  status,
  cost,
  meta,
  onClick,
  className = '',
}) => {
  return (
    <div onClick={onClick} className={`flex cursor-pointer flex-col gap-2 px-1 py-4 transition-colors hover:bg-tray ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="label-overline shrink-0 text-faint">{id}</span>
          <span className="label-overline shrink-0 text-accent">{priority}</span>
          <h4 className="truncate text-[15px] font-medium tracking-[-0.01em] text-ink">{title}</h4>
        </div>
        <div className="shrink-0">{status}</div>
      </div>
      <div className="flex items-center justify-between gap-3 pl-0.5 pr-0.5">
        <div className="flex min-w-0 items-center gap-2 text-[11px] text-faint">
          <Wrench className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
          <span className="truncate">{category}</span>
          <span className="text-line" aria-hidden="true">·</span>
          <span className="shrink-0">{meta}</span>
        </div>
        <span className="shrink-0 font-mono-numbers text-sm text-ink">{cost}</span>
      </div>
    </div>
  );
};