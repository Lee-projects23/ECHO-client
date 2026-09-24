import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface PaymentCardProps {
  title: string;
  subtitle: string;
  amount: string;
  status: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({ title, subtitle, amount, status, onClick, className = '' }) => {
  return (
    <div
      onClick={onClick}
      className={`group flex cursor-pointer items-center gap-4 py-4 transition-colors hover:bg-tray/60 anim-fade ${className}`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-tint transition-colors group-hover:border-accent/30 group-hover:text-accent">
        <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-[15px] font-medium tracking-[-0.01em] text-ink">{title}</h4>
        <div className="mt-0.5 truncate text-xs text-faint">{subtitle}</div>
      </div>
      <span className="shrink-0 font-mono-numbers text-[15px] font-medium text-ink">{amount}</span>
      <span className="shrink-0">{status}</span>
    </div>
  );
};