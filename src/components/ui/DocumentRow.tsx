import React from 'react';
import { FileText, Download } from 'lucide-react';

interface DocumentRowProps {
  name: string;
  meta: string;
  status?: React.ReactNode;
  onDownload: () => void;
  className?: string;
}

export const DocumentRow: React.FC<DocumentRowProps> = ({ name, meta, status, onDownload, className = '' }) => {
  return (
    <div
      className={`group flex items-center gap-3.5 rounded-xl px-3 py-3 transition-colors hover:bg-tray anim-fade ${className}`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
        <FileText className="h-4.5 w-4.5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-ink">{name}</div>
        <div className="truncate text-[11px] text-faint">{meta}</div>
      </div>
      {status && <div className="shrink-0">{status}</div>}
      <button
        onClick={onDownload}
        aria-label={`Download ${name}`}
        className="icon-btn ml-1 shrink-0"
      >
        <Download className="h-4 w-4" strokeWidth={1.75} />
      </button>
    </div>
  );
};