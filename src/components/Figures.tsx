import React from 'react';
import {fontFamily, palette, serifFamily} from '../theme';

const TAU = Math.PI * 2;

const pt = (cx: number, cy: number, r: number, a: number): [number, number] => [
  cx + r * Math.cos(a),
  cy + r * Math.sin(a),
];

const Head: React.FC<{x: number; y: number; angle: number; color: string; size?: number}> = ({
  x,
  y,
  angle,
  color,
  size = 17,
}) => {
  const p = (a: number, r: number) => `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`;
  return <polygon points={`${x},${y} ${p(angle + 2.55, size)} ${p(angle - 2.55, size)}`} fill={color} />;
};

const arcPath = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const [x0, y0] = pt(cx, cy, r, a0);
  const [x1, y1] = pt(cx, cy, r, a1);
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
  const sweep = a1 > a0 ? 1 : 0;
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} ${sweep} ${x1} ${y1}`;
};

export const Disc: React.FC<{
  rotation: number;
  size?: number;
  showRadius?: boolean;
  showAngle?: boolean;
  showForce?: boolean;
  showCentre?: boolean;
  radiusLabel?: string;
  forceLabel?: string;
  angleLabel?: string;
  accent?: string;
  labelSize?: number;
}> = ({
  rotation,
  size = 560,
  showRadius = true,
  showAngle = false,
  showForce = false,
  showCentre = true,
  radiusLabel = 'r',
  forceLabel = 'F',
  angleLabel = 'θ',
  accent = palette.indigo,
  labelSize = 34,
}) => {
  const c = size / 2;
  const R = size * 0.36;
  const a = (rotation * Math.PI) / 180;
  const [px, py] = pt(c, c, R, a);
  const tangent = a + Math.PI / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={c} cy={c} r={R} fill="#ffffff" stroke={palette.rule} strokeWidth={3} />
      <circle cx={c} cy={c} r={R * 0.62} fill="none" stroke={palette.rule} strokeWidth={2} strokeDasharray="8 12" />

      {showAngle ? (
        <>
          <path d={arcPath(c, c, R * 0.46, 0, a)} fill="none" stroke={palette.amberDeep} strokeWidth={5} strokeLinecap="round" />
          <text
            x={c + R * 0.6 * Math.cos(a / 2)}
            y={c + R * 0.6 * Math.sin(a / 2) + 12}
            fontFamily={serifFamily}
            fontSize={labelSize}
            fill={palette.amberDeep}
          >
            {angleLabel}
          </text>
        </>
      ) : null}

      {showRadius ? (
        <>
          <line x1={c} y1={c} x2={px} y2={py} stroke={palette.ink} strokeWidth={5} strokeLinecap="round" />
          <text
            x={c + R * 0.5 * Math.cos(a) - 10}
            y={c + R * 0.5 * Math.sin(a) - 18}
            fontFamily={serifFamily}
            fontSize={labelSize}
            fill={palette.ink}
          >
            {radiusLabel}
          </text>
        </>
      ) : null}

      {showForce ? (
        <>
          <line
            x1={px}
            y1={py}
            x2={px + 130 * Math.cos(tangent)}
            y2={py + 130 * Math.sin(tangent)}
            stroke={palette.teal}
            strokeWidth={6}
            strokeLinecap="round"
          />
          <Head
            x={px + 130 * Math.cos(tangent)}
            y={py + 130 * Math.sin(tangent)}
            angle={tangent}
            color={palette.teal}
          />
          <text
            x={px + 150 * Math.cos(tangent) + (Math.cos(tangent) > 0 ? 4 : -34)}
            y={py + 150 * Math.sin(tangent) + 10}
            fontFamily={serifFamily}
            fontSize={labelSize}
            fill={palette.teal}
          >
            {forceLabel}
          </text>
        </>
      ) : null}

      <circle cx={px} cy={py} r={13} fill={accent} />
      {showCentre ? <circle cx={c} cy={c} r={11} fill={palette.ink} /> : null}
    </svg>
  );
};

export const PushBox: React.FC<{
  shift?: number;
  forceLabel?: string;
  distanceLabel?: string;
  accent?: string;
}> = ({shift = 0, forceLabel = 'F', distanceLabel = 'd', accent = palette.teal}) => {
  const boxX = 120 + shift;
  return (
    <svg width={680} height={420} viewBox="0 0 680 420">
      <line x1={40} y1={330} x2={640} y2={330} stroke={palette.rule} strokeWidth={4} strokeLinecap="round" />
      <rect x={boxX} y={230} width={120} height={100} rx={14} fill="#ffffff" stroke={palette.ink} strokeWidth={4} />
      <line x1={boxX - 110} y1={280} x2={boxX - 14} y2={280} stroke={accent} strokeWidth={7} strokeLinecap="round" />
      <Head x={boxX - 14} y={280} angle={0} color={accent} />
      <text x={boxX - 96} y={252} fontFamily={serifFamily} fontSize={38} fill={accent}>
        {forceLabel}
      </text>
      <line x1={boxX} y1={372} x2={boxX + 120} y2={372} stroke={palette.muted} strokeWidth={3} strokeDasharray="9 9" />
      <line x1={boxX} y1={360} x2={boxX} y2={384} stroke={palette.muted} strokeWidth={3} />
      <line x1={boxX + 120} y1={360} x2={boxX + 120} y2={384} stroke={palette.muted} strokeWidth={3} />
      <text x={boxX + 44} y={412} fontFamily={serifFamily} fontSize={34} fill={palette.muted}>
        {distanceLabel}
      </text>
    </svg>
  );
};

export const Bars: React.FC<{heights: number[]; accent?: string; caption?: string}> = ({
  heights,
  accent = palette.indigo,
  caption,
}) => {
  const w = 88;
  const gap = 26;
  const base = 340;
  return (
    <svg width={560} height={420} viewBox="0 0 560 420">
      <line x1={30} y1={base} x2={530} y2={base} stroke={palette.rule} strokeWidth={4} strokeLinecap="round" />
      {heights.map((h, i) => (
        <rect
          key={i}
          x={60 + i * (w + gap)}
          y={base - h}
          width={w}
          height={h}
          rx={12}
          fill={i === heights.length - 1 ? accent : palette.indigoSoft}
        />
      ))}
      {caption ? (
        <text x={30} y={400} fontFamily={fontFamily} fontSize={24} fill={palette.muted}>
          {caption}
        </text>
      ) : null}
    </svg>
  );
};

export const SpinGlyph: React.FC<{size?: number; color?: string}> = ({size = 300, color = palette.indigo}) => (
  <svg width={size} height={size} viewBox="0 0 300 300">
    <path d={arcPath(150, 150, 110, -2.4, 1.2)} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" />
    <Head x={150 + 110 * Math.cos(1.2)} y={150 + 110 * Math.sin(1.2)} angle={1.2 + Math.PI / 2} color={color} size={22} />
    <circle cx={150} cy={150} r={16} fill={color} />
  </svg>
);

export const TAU_CONST = TAU;
