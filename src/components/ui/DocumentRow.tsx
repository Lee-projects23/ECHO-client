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
      className={`group flex items-center gap-4 py-4 transition-colors hover:bg-tray/60 anim-fade ${className}`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-tint transition-colors group-hover:border-accent/30 group-hover:text-accent">
        <FileText className="h-4 w-4" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-medium tracking-[-0.01em] text-ink">{name}</div>
        <div className="truncate text-xs text-faint">{meta}</div>
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