import React from 'react';
import {Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Cue} from './SubtitleTrack';

/**
 * 音轨：配音 + 背景音乐（带自动闪避）。
 *
 * 设计要点：
 * - 配音是全片主音轨，音量恒定
 * - BGM 用「按帧计算的音量」实现 ducking：有人声时压到 30%，空隙回升到 100%，
 *   避免解说被音乐糊住（这是科普视频最常见的翻车点）
 * - 首尾各做淡入淡出，避免硬切
 */

const DUCK_RATIO = 0.3;   // 有人声时 BGM 保留的比例
const DUCK_FADE = 0.35;   // 闪避过渡时长（秒）

/** 计算某一秒的「人声压制强度」：0 = 无人声，1 = 正在说话 */
const speechPressure = (t: number, cues: Cue[]) => {
  let p = 0;
  for (const c of cues) {
    // 进入：说话前 0.35s 开始压
    const rise = interpolate(t, [c.start - DUCK_FADE, c.start], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    // 退出：说完 0.1s 后回升
    const fall = interpolate(t, [c.end + 0.1, c.end + 0.1 + DUCK_FADE], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    p = Math.max(p, Math.min(rise, fall));
  }
  return p;
};

export const AudioTrack: React.FC<{
  cues: Cue[];
  voiceSrc?: string | null;
  bgmSrc?: string | null;
  bgmVolume?: number;
}> = ({cues, voiceSrc = 'voice.mp3', bgmSrc = 'bgm.mp3', bgmVolume = 0.34}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / fps;

  const pressure = speechPressure(t, cues);
  const fadeIn = interpolate(t, [0, 1.5], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(t, [(durationInFrames / fps) - 2.5, durationInFrames / fps], [1, 0], {
    extrapolateLeft: 'clamp',
  });
  const vol = bgmVolume * (1 - pressure * (1 - DUCK_RATIO)) * fadeIn * fadeOut;

  return (
    <>
      {voiceSrc ? <Audio src={staticFile(voiceSrc)} volume={1} /> : null}
      {bgmSrc ? <Audio src={staticFile(bgmSrc)} volume={vol} loop /> : null}
    </>
  );
};
