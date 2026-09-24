import React from 'react';

export interface ChartDatum {
  label: string;
  value: number;
}

interface ChartProps {
  type?: 'line' | 'bar';
  data: ChartDatum[];
  height?: number;
  color?: string;
  format?: (value: number) => string;
  className?: string;
}

/**
 * Minimal SVG chart in the reference language: neutral base, soft gray
 * supporting lines, single accent for the series. No multi-colour output.
 */
export const Chart: React.FC<ChartProps> = ({
  type = 'line',
  data,
  height = 180,
  color = '#ef4d23',
  format = v => String(v),
  className = '',
}) => {
  const n = data.length;
  if (n === 0) return null;

  const padL = 10;
  const padR = 10;
  const padT = 14;
  const padB = 34;
  const W = Math.max(140, n > 1 ? (n - 1) * 56 + 24 : 120);
  const H = height + padB + padT;
  const maxV = Math.max(...data.map(d => d.value), 1);

  const xAt = (i: number) => padL + (n > 1 ? i * ((W - padL - padR) / (n - 1)) : W / 2);
  const yAt = (v: number) => padT + (1 - v / maxV) * (height - padT);

  const linePoints = data.map((d, i) => `${xAt(i)},${yAt(d.value)}`).join(' ');
  const areaPoints = `${padL},${padT + height} ${linePoints} ${W - padR},${padT + height}`;

  const gridLines = [0, 0.33, 0.66, 1].map(g => ({
    y: padT + g * (height - padT),
    val: maxV * (1 - g),
  }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`w-full ${className}`} role="img">
      {gridLines.map((g, i) => (
        <line
          key={i}
          x1={padL}
          x2={W - padR}
          y1={g.y}
          y2={g.y}
          stroke="var(--color-line)"
          strokeWidth="1"
          strokeDasharray={i > 0 ? '3 4' : undefined}
        />
      ))}

      {type === 'line' ? (
        <>
          <polygon points={areaPoints} fill={color} opacity="0.06" />
          <polyline
            points={linePoints}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {data.map((d, i) => (
            <g key={i}>
              <circle cx={xAt(i)} cy={yAt(d.value)} r="3" fill={color} />
              <circle cx={xAt(i)} cy={yAt(d.value)} r="5" fill={color} opacity="0.18" />
            </g>
          ))}
        </>
      ) : (
        data.map((d, i) => {
          const barW = Math.max(14, (W - padL - padR) / n * 0.5);
          const bh = padT + height - yAt(d.value);
          return (
            <rect
              key={i}
              x={xAt(i) - barW / 2}
              y={yAt(d.value)}
              width={barW}
              height={bh}
              rx={Math.min(6, barW / 2)}
              fill={color}
              opacity={0.9}
            />
          );
        })
      )}

      {data.map((d, i) => (
        <text
          key={i}
          x={xAt(i)}
          y={H - 26}
          textAnchor="middle"
          fontSize="9.5"
          fontWeight="600"
          fill="var(--color-faint)"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {format(d.value)}
        </text>
      ))}
      {data.map((d, i) => (
        <text
          key={`l${i}`}
          x={xAt(i)}
          y={H - 9}
          textAnchor="middle"
          fontSize="9"
          fill="var(--color-tint)"
          fontWeight="600"
        >
          {d.label}
        </text>
      ))}
    </svg>
  );
};