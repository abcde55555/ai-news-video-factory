import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {FONT_CN, FONT_NUM, light} from '../theme';
import {Rise} from './primitives';

/**
 * 官方原文证据页。
 * 原则（证据先于文案）：先给整段原文让观众认出来源，再用荧光笔只覆盖关键词，
 * 中文结论单独放在画面空白处，页脚标明来源与日期。
 * 截图来自 Meta 官方新闻稿页面，未被改写。
 */

type Variant = 'takeaways' | 'realworld';

const EV: Record<
  Variant,
  {
    img: string;
    aspect: number;
    title: string;
    kicker: string;
    highlights: {x: number; y: number; w: number; h: number}[];
    conclusion: string;
    note: string;
  }
> = {
  takeaways: {
    img: 'official/seg_takeaways.jpg',
    aspect: 1080 / 288,
    kicker: '官方原文',
    title: '官方自己举的例子，就是保险理赔',
    // 坐标由 PIL 像素测量得出（图 1080x300），勿手调
    highlights: [
      {x: 6.1, y: 53.0, w: 56.0, h: 6.6}, // "insurance claim to making sense of a lease to building a working app."
      {x: 6.1, y: 77.2, w: 30.0, h: 5.8}, // "Meta Model API and Muse Code"
    ],
    conclusion: '所以片头那个理赔场景不是我编的，是官方的原话。',
    note: 'about.fb.com · Newsroom · 2026-10-12',
  },
  realworld: {
    img: 'official/seg_realworld.jpg',
    aspect: 1080 / 160,
    kicker: '官方原文',
    title: 'Built for Real World Needs 段',
    // 坐标由 PIL 像素测量得出（图 1080x220）
    highlights: [
      {x: 17.0, y: 53.5, w: 47.0, h: 10.5}, // "navigating an insurance claim, understanding a lease"
    ],
    conclusion: '法律、金融、健康这些专业领域，是官方明确写出来的目标场景。',
    note: 'about.fb.com · Newsroom · 2026-10-12',
  },
};

export const OfficialEvidence: React.FC<{variant: Variant}> = ({variant}) => {
  const d = EV[variant];
  const frame = useCurrentFrame();
  // 荧光笔：依次刷过每个高亮块
  const brush = (i: number) =>
    interpolate(frame, [18 + i * 12, 30 + i * 12], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  return (
    <AbsoluteFill style={{backgroundColor: light.bg, fontFamily: FONT_CN}}>
      <AbsoluteFill style={{padding: '72px 110px 150px', display: 'flex', flexDirection: 'column'}}>
        <Rise delay={0} distance={14}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <span
              style={{
                background: light.ink,
                color: '#fff',
                fontSize: 24,
                fontWeight: 800,
                padding: '8px 20px',
                borderRadius: 8,
                letterSpacing: 1,
              }}
            >
              {d.kicker}
            </span>
            <span style={{fontSize: 27, color: light.sub}}>Meta Newsroom 截图，原文未改写</span>
          </div>
        </Rise>
        <Rise delay={4} distance={20}>
          <div style={{fontSize: 52, fontWeight: 800, color: light.ink, margin: '22px 0 26px'}}>{d.title}</div>
        </Rise>

        {/* 截图卡片 + 高亮 */}
        <div
          style={{
            width: 1400,
            borderRadius: 14,
            background: '#fff',
            border: '1px solid #E3DFD6',
            boxShadow: '0 18px 48px rgba(20,19,26,0.12)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div style={{height: 34, background: '#F4F2EC', display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 16}}>
            {['#E5645A', '#E9B44C', '#66B06A'].map((c, i) => (
              <span key={i} style={{width: 12, height: 12, borderRadius: 6, background: c}} />
            ))}
            <span style={{fontSize: 15, color: '#9A968C', marginLeft: 12, fontFamily: FONT_NUM}}>
              about.fb.com/news/2026/10/introducing-muse-wonder-models
            </span>
          </div>
          <div style={{position: 'relative'}}>
            <Img src={staticFile(d.img)} style={{width: 1400, height: 1400 / d.aspect, display: 'block'}} />
            {d.highlights.map((h, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${h.x}%`,
                  top: `${h.y}%`,
                  width: `${h.w * brush(i)}%`,
                  height: `${h.h}%`,
                  background: 'rgba(255,214,64,0.55)',
                  mixBlendMode: 'multiply',
                  borderRadius: 3,
                }}
              />
            ))}
          </div>
        </div>

        <Rise delay={34} distance={18}>
          <div style={{marginTop: 30, fontSize: 40, fontWeight: 700, color: light.ink, lineHeight: 1.45}}>
            {d.conclusion}
          </div>
        </Rise>
        <div style={{marginTop: 'auto', fontFamily: FONT_NUM, fontSize: 20, color: light.faint, letterSpacing: 0.5}}>
          来源：{d.note}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
