import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand, FONT_CN, FONT_NUM, light} from '../theme';

/**
 * 细节层组件：来自原片拆解报告中被量化的几个特征
 * - 右上角固定品牌水印（10/10 视频都有，系列识别度来源）
 * - 章节大标题页（每 20-50s 一次视觉重定位）
 * - 页面缓慢推近 100% -> 106%（原片"硬切 + 页内持续小动作"的关键）
 * - 荧光笔高亮 / 红圈强调
 */

/* ---------------- 1. 品牌水印 ---------------- */

/**
 * 右上角品牌水印。
 * 名称与首字来自 theme.ts 的 `brand`，默认为空即不渲染——
 * 不要填入他人的名字/头像（那是他人的署名与肖像，也构成冒充）。
 */
export const BrandMark: React.FC<{name?: string; initial?: string; tone?: 'light' | 'dark'}> = ({
  name = brand.name,
  initial = brand.initial,
  tone = 'light',
}) => {
  const frame = useCurrentFrame();
  if (!name) return null;
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 200, mass: 0.5}, durationInFrames: 18});
  const fg = tone === 'dark' ? '#FFFFFF' : light.ink;
  return (
    <div
      style={{
        position: 'absolute',
        top: 46,
        right: 56,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        opacity: p * 0.92,
        transform: `translateY(${(1 - p) * -12}px)`,
        zIndex: 50,
      }}
    >
      <div style={{fontFamily: FONT_CN, fontSize: 24, fontWeight: 700, color: fg, opacity: 0.85}}>{name}</div>
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 23,
          background: `linear-gradient(135deg, ${light.accent}, #6C5CE7)`,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT_CN,
          fontSize: 21,
          fontWeight: 800,
          boxShadow: '0 4px 14px rgba(20,19,26,0.18)',
        }}
      >
        {initial || name.slice(0, 1)}
      </div>
    </div>
  );
};

/* ---------------- 2. 页面缓慢推近 ---------------- */

/** Ken Burns：整页从 100% 缓推到 106%，消除"静帧感"。原片页内持续小动作的主要来源。 */
export const KenBurns: React.FC<{children: React.ReactNode; to?: number}> = ({children, to = 1.06}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const s = interpolate(frame, [0, durationInFrames], [1, to], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: '52% 48%'}}>
      {children}
    </AbsoluteFill>
  );
};

/* ---------------- 3. 章节页 ---------------- */

/** 章节大标题：4-10 字，深色加粗靠左上，只承担一次视觉重定位，停留 2.5-4s */
export const ChapterPage: React.FC<{title: string; index?: string}> = ({title, index}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = Array.from(title);
  return (
    <AbsoluteFill style={{backgroundColor: light.bg, fontFamily: FONT_CN}}>
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(circle at 22% 40%, #FFFFFF 0%, rgba(255,255,255,0) 60%)'}} />
      <div style={{position: 'absolute', left: 130, top: '43%', transform: 'translateY(-50%)'}}>
        {index ? (
          <div style={{fontFamily: FONT_NUM, fontSize: 24, fontWeight: 800, letterSpacing: 6, color: light.accent, marginBottom: 18}}>
            {index}
          </div>
        ) : null}
        <div style={{display: 'flex'}}>
          {words.map((w, i) => {
            const p = spring({frame: frame - i * 3, fps, config: {damping: 200, mass: 0.4}, durationInFrames: 14});
            return (
              <span
                key={i}
                style={{
                  fontSize: 96,
                  fontWeight: 800,
                  letterSpacing: 2,
                  color: light.ink,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 34}px)`,
                  display: 'inline-block',
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 26,
            height: 8,
            width: interpolate(frame, [8, 26], [0, 300], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
            background: light.accent,
            borderRadius: 4,
          }}
        />
      </div>
      <BrandMark />
    </AbsoluteFill>
  );
};

/* ---------------- 4. 强调：荧光笔 / 红圈 ---------------- */

/** 荧光笔：从左向右刷过的高亮块（放在文字/数值下方） */
export const Highlighter: React.FC<{
  children: React.ReactNode;
  color?: string;
  delay?: number;
  style?: React.CSSProperties;
}> = ({children, color = '#FFE066', delay = 0, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const w = interpolate(frame - delay, [0, 12], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <span style={{position: 'relative', display: 'inline-block', ...style}}>
      <span
        style={{
          position: 'absolute',
          left: -6,
          bottom: -2,
          height: '58%',
          width: `${w}%`,
          background: color,
          zIndex: -1,
          borderRadius: 2,
        }}
      />
      {children}
    </span>
  );
};

/** 红圈：手绘感椭圆强调圈，用于圈出关键数字或区域 */
export const RedCircle: React.FC<{
  width: number;
  height: number;
  delay?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({width, height, delay = 0, style, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: {damping: 12, mass: 0.6}, durationInFrames: 16});
  return (
    <div style={{position: 'absolute', width, height, ...style}}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{overflow: 'visible'}}>
        <ellipse
          cx={width / 2}
          cy={height / 2}
          rx={width / 2}
          ry={height / 2}
          fill="none"
          stroke="#E5484D"
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * ((width + height) / 4)}
          strokeDashoffset={2 * Math.PI * ((width + height) / 4) * (1 - p)}
          transform={`rotate(-4 ${width / 2} ${height / 2})`}
        />
      </svg>
      {children}
    </div>
  );
};

/* ---------------- 5. 鼠标指针（模拟操作产品界面） ---------------- */

export const Pointer: React.FC<{path: [number, number][]; clickAt?: number}> = ({path, clickAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (path.length < 2) return null;
  const seg = Math.max(1, Math.floor(40 / (path.length - 1)));
  const i = Math.min(path.length - 2, Math.floor(Math.max(0, frame) / seg));
  const local = (Math.max(0, frame) - i * seg) / seg;
  const [x0, y0] = path[i];
  const [x1, y1] = path[i + 1];
  const x = x0 + (x1 - x0) * local;
  const y = y0 + (y1 - y0) * local;
  const pressed = clickAt !== undefined && frame >= clickAt * fps;
  return (
    <div style={{position: 'absolute', left: x, top: y, zIndex: 60, transform: `scale(${pressed ? 0.86 : 1})`}}>
      <svg width={30} height={30} viewBox="0 0 24 24">
        <path d="M5 2 L5 19 L9.5 14.5 L12.5 21 L15.5 19.5 L12.5 13.5 L19 13.5 Z" fill="#14131A" stroke="#fff" strokeWidth={1.4} />
      </svg>
      {pressed ? (
        <div style={{position: 'absolute', left: -10, top: -10, width: 40, height: 40, borderRadius: 20, border: '3px solid ' + light.accent, opacity: 0.7}} />
      ) : null}
    </div>
  );
};
