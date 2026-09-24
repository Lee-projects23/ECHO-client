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
    <div onClick={onClick} className={`group flex cursor-pointer gap-4 rounded-2xl border border-line bg-raise p-4.5 transition-all hover:border-linestrong anim-fade ${className}`}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
        <CheckCircle2 className="h-4.5 w-4.5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h4 className="truncate text-sm font-medium text-ink">{title}</h4>
          <span className="shrink-0 font-mono-numbers text-base text-ink">{amount}</span>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-3">
          <span className="truncate text-[11px] text-faint">{subtitle}</span>
          <span className="shrink-0">{status}</span>
        </div>
      </div>
    </div>
  );
};