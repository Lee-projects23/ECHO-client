import React from 'react';

export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'neutral';

const TONE_STYLES: Record<StatusTone, string> = {
  success: 'bg-emerald-500/10 text-emerald-700 ring-emerald-600/15 dark:text-emerald-400',
  warning: 'bg-amber-500/10 text-amber-700 ring-amber-600/15 dark:text-amber-400',
  danger: 'bg-red-500/10 text-red-600 ring-red-600/20 dark:text-red-400',
  info: 'bg-sky-500/10 text-sky-700 ring-sky-600/15 dark:text-sky-400',
  accent: 'bg-accent/10 text-accent ring-accent/25',
  neutral: 'bg-neutral-500/10 text-tint ring-line',
};

const RETURNING: string[] = [
  'completed',
  'resolved',
  'closed',
  'paid',
  'settled',
  'success',
  'approved',
  'disbursed',
  'accepted',
  'successful',
];

const BLOCKING: string[] = [
  'overdue',
  'failed',
  'declined',
  'rejected',
  'expired',
];

const PENDING: string[] = [
  'in progress',
  'work in progress',
  'pending',
  'partially paid',
  'raised',
  'acknowledged',
  'awaiting',
  'processing',
  'sent',
  'viewed',
  'pending review',
  'scheduled',
];

export const toneFor = (status: string): StatusTone => {
  const s = status.toLowerCase();
  if (RETURNING.some(x => s.includes(x))) return 'success';
  if (BLOCKING.some(x => s.includes(x))) return 'danger';
  if (PENDING.some(x => s.includes(x))) return 'warning';
  if (s.includes('assigned') || s.includes('active')) return 'info';
  return 'neutral';
};

interface StatusProps {
  status: string;
  tone?: StatusTone;
  dot?: boolean;
  className?: string;
}

export const Status: React.FC<StatusProps> = ({ status, tone, dot = true, className = '' }) => {
  const t = tone || toneFor(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset whitespace-nowrap ${TONE_STYLES[t]} ${className}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />}
      {status}
    </span>
  );
};