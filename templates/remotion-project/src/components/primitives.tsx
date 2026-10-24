import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/** 通用入场：上浮 + 淡入，delay 以帧为单位 */
export const Rise: React.FC<{
  delay?: number;
  distance?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({delay = 0, distance = 40, children, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: {damping: 200, mass: 0.45},
    durationInFrames: 14,
  });
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * distance}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** 数字滚动：从 0 增长到 value */
export const CountUp: React.FC<{
  value: number;
  decimals?: number;
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
  suffix?: string;
  prefix?: string;
}> = ({value, decimals = 0, delay = 0, duration = 18, style, suffix, prefix}) => {
  const frame = useCurrentFrame();
  const eased = interpolate(
    frame - delay,
    [0, duration],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)},
  );
  return (
    <span style={{fontVariantNumeric: 'tabular-nums', ...style}}>
      {prefix}
      {(value * eased).toFixed(decimals)}
      {suffix}
    </span>
  );
};

/** 从左向右展开的进度条 */
export const GrowBar: React.FC<{
  to: number;
  delay?: number;
  duration?: number;
  height?: number;
  color: string;
  track?: string;
  radius?: number;
}> = ({to, delay = 0, duration = 16, height = 26, color, track = '#E6E2DA', radius = 13}) => {
  const frame = useCurrentFrame();
  const w = interpolate(
    frame - delay,
    [0, duration],
    [0, to],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)},
  );
  return (
    <div style={{width: '100%', height, borderRadius: radius, background: track, overflow: 'hidden'}}>
      <div style={{width: `${w}%`, height: '100%', borderRadius: radius, background: color}} />
    </div>
  );
};

/** 章节小标题（左上标签） */
export const Kicker: React.FC<{text: string; color?: string; bg?: string; delay?: number}> = ({
  text,
  color = '#0866FF',
  bg = '#DCE8FF',
  delay = 0,
}) => (
  <Rise delay={delay} distance={16}>
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 22px',
        borderRadius: 999,
        background: bg,
        color,
        fontSize: 26,
        fontWeight: 700,
        letterSpacing: 1,
      }}
    >
      <span style={{width: 10, height: 10, borderRadius: 5, background: color}} />
      {text}
    </div>
  </Rise>
);

/** 大标题，按字逐字上浮（模拟动效片文字入场） */
export const StaggerText: React.FC<{
  text: string;
  delay?: number;
  perChar?: number;
  style?: React.CSSProperties;
}> = ({text, delay = 0, perChar = 1.3, style}) => {
  const chars = Array.from(text);
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', ...style}}>
      {chars.map((c, i) => (
        <Rise key={i} delay={delay + i * perChar} distance={28}>
          <span style={{whiteSpace: 'pre'}}>{c}</span>
        </Rise>
      ))}
    </div>
  );
};

/** 页面底色容器 */
export const Scene: React.FC<{
  bg: string;
  children: React.ReactNode;
  overlay?: React.CSSProperties;
}> = ({bg, children, overlay}) => (
  <AbsoluteFill style={{backgroundColor: bg}}>
    {overlay ? <AbsoluteFill style={overlay} /> : null}
    {children}
  </AbsoluteFill>
);
