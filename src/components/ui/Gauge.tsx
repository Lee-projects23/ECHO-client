import React from 'react';

interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
  color?: string;
  showLabels?: boolean;
  display?: string;
  label?: string;
  className?: string;
}

/**
 * 180° SVG tick-mark gauge — Convix reference visual language.
 * Renders a semicircular band of radial ticks; active ticks use the accent
 * color, inactive ticks use the muted neutral line tone.
 */
export const Gauge: React.FC<GaugeProps> = ({
  value,
  min = 0,
  max = 100,
  color = '#ef4d23',
  showLabels = true,
  display,
  label,
  className = '',
}) => {
  const safeMax = Math.max(1, max - min);
  const fraction = Math.max(0, Math.min(1, (value - min) / safeMax));
  const TICKS = 41;
  const activeTicks = Math.round(TICKS * fraction);

  const cx = 100;
  const cy = 100;
  const r1 = 70;
  const r2 = 82;

  const ticks = Array.from({ length: TICKS }, (_, i) => {
    const theta = Math.PI * (1 - i / (TICKS - 1));
    return {
      x1: cx + r1 * Math.cos(theta),
      y1: cy + r1 * Math.sin(theta),
      x2: cx + r2 * Math.cos(theta),
      y2: cy + r2 * Math.sin(theta),
      active: i <= activeTicks,
    };
  });

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg viewBox="0 0 200 188" className="w-full max-w-[230px]">
        {/* Guide arc */}
        <path
          d="M 18 100 A 82 82 0 0 0 182 100"
          fill="none"
          stroke="var(--color-line)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.active ? color : 'var(--color-line)'}
            strokeWidth={t.active ? 2.5 : 1.5}
            strokeLinecap="round"
          />
        ))}

        {showLabels && (
          <>
            <text x="44" y="176" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--color-faint)">
              {min}
            </text>
            <text x="156" y="176" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--color-faint)">
              {max}
            </text>
          </>
        )}
      </svg>

      <div className="-mt-14 text-center">
        <div className="font-serif text-3xl sm:text-4xl leading-none text-ink" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {display ?? value}
        </div>
        {label && <div className="mt-1.5 label-overline">{label}</div>}
      </div>
    </div>
  );
};