import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT_CN} from '../theme';

export type Cue = {start: number; end: number; text: string};

/**
 * 底部硬字幕轨（输入单位为秒，内部按 fps 换算）。
 * 静音播放也能看懂 —— 信息流场景的关键兼容设计。
 */
export const SubtitleTrack: React.FC<{cues: Cue[]}> = ({cues}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const active = cues.find((c) => frame >= c.start * fps && frame < c.end * fps);

  if (!active) return null;

  const s = active.start * fps;
  const e = active.end * fps;
  const enter = interpolate(frame, [s, s + 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const exit = interpolate(frame, [e - 5, e], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacity = Math.min(enter, 1 - exit);

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', pointerEvents: 'none'}}>
      <div
        style={{
          opacity,
          transform: `translateY(${(1 - enter) * 12}px)`,
          marginBottom: 58,
          maxWidth: 1580,
          background: 'rgba(12,12,16,0.86)',
          color: '#fff',
          fontSize: 40,
          lineHeight: 1.45,
          fontWeight: 600,
          fontFamily: FONT_CN,
          padding: '20px 42px',
          borderRadius: 20,
          textAlign: 'center',
        }}
      >
        {active.text}
      </div>
    </AbsoluteFill>
  );
};
