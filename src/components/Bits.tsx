import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily, palette, serifFamily} from '../theme';

export const Stage: React.FC<{
  children: React.ReactNode;
  kicker?: string;
  accent?: string;
}> = ({children, kicker, accent = palette.indigo}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.paper,
        fontFamily,
        color: palette.ink,
        padding: '70px 110px 96px 110px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {kicker ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            fontSize: 21,
            letterSpacing: '0.24em',
            fontWeight: 700,
            color: palette.muted,
            textTransform: 'uppercase',
          }}
        >
          <span
            style={{
              width: 46,
              height: 4,
              backgroundColor: accent,
              display: 'inline-block',
              borderRadius: 2,
            }}
          />
          {kicker}
        </div>
      ) : null}
      <div style={{flex: 1, display: 'flex', alignItems: 'center', gap: 72, marginTop: 16}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

export const Rise: React.FC<{
  children: React.ReactNode;
  delay?: number;
  y?: number;
  style?: React.CSSProperties;
}> = ({children, delay = 0, y = 26, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: {damping: 200, mass: 0.7, stiffness: 110},
  });
  return (
    <div style={{opacity: p, transform: `translateY(${(1 - p) * y}px)`, ...style}}>{children}</div>
  );
};

export const Heading: React.FC<{children: React.ReactNode; size?: number; style?: React.CSSProperties}> = ({
  children,
  size = 74,
  style,
}) => (
  <div
    style={{
      fontSize: size,
      fontWeight: 800,
      letterSpacing: '-0.028em',
      lineHeight: 1.06,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Body: React.FC<{children: React.ReactNode; size?: number; style?: React.CSSProperties}> = ({
  children,
  size = 33,
  style,
}) => (
  <div style={{fontSize: size, lineHeight: 1.45, color: palette.inkSoft, maxWidth: 760, ...style}}>
    {children}
  </div>
);

export const Formula: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({children, size = 62, color = palette.ink, style}) => (
  <div
    style={{
      fontFamily: serifFamily,
      fontSize: size,
      color,
      lineHeight: 1.25,
      letterSpacing: '0.01em',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Note: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontSize: 25, color: palette.muted, fontWeight: 500, letterSpacing: '0.01em', ...style}}>
    {children}
  </div>
);

export const Card: React.FC<{
  children: React.ReactNode;
  bg?: string;
  border?: string;
  style?: React.CSSProperties;
}> = ({children, bg = '#ffffff', border = palette.rule, style}) => (
  <div
    style={{
      backgroundColor: bg,
      border: `2px solid ${border}`,
      borderRadius: 22,
      padding: '30px 40px',
      ...style,
    }}
  >
    {children}
  </div>
);
