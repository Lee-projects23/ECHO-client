import React from 'react';

export type MetricTone = 'default' | 'accent' | 'success' | 'warning' | 'danger';

const VALUE_TONES: Record<MetricTone, string> = {
  default: 'text-ink',
  accent: 'text-accent',
  success: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-600 dark:text-amber-400',
  danger: 'text-red-600 dark:text-red-400',
};

interface MetricProps {
  label: string;
  value: string;
  sub?: string;
  tone?: MetricTone;
  className?: string;
}

export const Metric: React.FC<MetricProps> = ({ label, value, sub, tone = 'default', className = '' }) => {
  return (
    <div className={`px-5 py-6 sm:px-7 ${className}`}>
      <div className="label-overline">{label}</div>
      <div
        className={`mt-2.5 font-serif text-3xl sm:text-4xl leading-none tracking-tight ${VALUE_TONES[tone]}`}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {value}
      </div>
      {sub && <div className="mt-2 text-[11px] text-faint leading-relaxed">{sub}</div>}
    </div>
  );
};