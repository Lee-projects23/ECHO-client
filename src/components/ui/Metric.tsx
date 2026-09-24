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
    <div className={`py-5 ${className}`}>
      <div className="label-overline">{label}</div>
      <div
        className={`mt-2 text-[30px] font-medium leading-none tracking-[-0.03em] ${VALUE_TONES[tone]}`}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {value}
      </div>
      {sub && <div className="mt-2 text-[11px] leading-relaxed text-faint">{sub}</div>}
    </div>
  );
};