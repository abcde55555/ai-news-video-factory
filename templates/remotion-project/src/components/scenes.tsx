import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {blueprint, FONT_CN, FONT_NUM, gridBackground, light, shell} from '../theme';
import {CountUp, GrowBar, Kicker, Rise, Scene, StaggerText} from './primitives';
import {TitlePhoneBurst} from './PhoneChat';

/* ---------------------------------- 1. 标题卡 ---------------------------------- */

const WonderWall: React.FC = () => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, 150], [0, -60]);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div style={{transform: `translateY(${y}px)`, opacity: 0.055}}>
        {Array.from({length: 14}).map((_, r) => (
          <div
            key={r}
            style={{
              fontFamily: FONT_NUM,
              fontSize: 92,
              fontWeight: 800,
              letterSpacing: 6,
              whiteSpace: 'nowrap',
              color: light.ink,
              lineHeight: 1.05,
            }}
          >
            {Array.from({length: 9}).map((__, c) => (
              <span key={c}>WONDER </span>
            ))}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const lineW = interpolate(frame, [30, 60], [0, 520], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Scene bg={light.bg}>
      <WonderWall />
      <AbsoluteFill style={{...shell, flexDirection: 'row', alignItems: 'center', gap: 60}}>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <Kicker text="2026.10.12 · Meta 发布" bg="#E7ECF5" color={light.ink} />
          <StaggerText
            text="Muse Wonder"
            delay={6}
            style={{
              fontFamily: FONT_NUM,
              fontSize: 132,
              fontWeight: 800,
              letterSpacing: -3,
              color: light.ink,
              marginTop: 20,
            }}
          />
          <div style={{height: 6, width: lineW, background: light.accent, marginTop: 22, borderRadius: 3}} />
          <Rise delay={34} distance={30}>
            <div style={{fontSize: 46, fontWeight: 600, color: light.ink, marginTop: 40, lineHeight: 1.5}}>
              所有人都在比谁装得多
            </div>
          </Rise>
          <Rise delay={46} distance={30}>
            <div style={{fontSize: 46, fontWeight: 600, color: light.accent, marginTop: 8, lineHeight: 1.5}}>
              它反过来问：该记住什么
            </div>
          </Rise>
        </div>
        <TitlePhoneBurst />
      </AbsoluteFill>
    </Scene>
  );
};

/* ---------------------------------- 2. 四宫格 ---------------------------------- */

const ICONS: Record<string, React.ReactNode> = {
  memory: <circle cx="24" cy="24" r="15" fill="none" stroke="currentColor" strokeWidth="4" />,
  reroute: <path d="M12 34 h14 a10 10 0 0 0 0-20 h-6 M36 14 l8 8 -8 8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />,
  confirm: <path d="M14 24 l9 9 15-17" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />,
  focus: <path d="M24 8 v8 M24 32 v8 M8 24 h8 M32 24 h8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />,
};

export const FourGrid: React.FC<{
  items: {icon: keyof typeof ICONS; title: string; desc: string}[];
}> = ({items}) => (
  <Scene bg={light.bg}>
    <AbsoluteFill style={shell}>
      <Kicker text="四个关键词" />
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 34,
          alignContent: 'center',
        }}
      >
        {items.map((it, i) => (
          <Rise key={i} delay={i * 6} distance={40}>
            <div
              style={{
                background: light.surface,
                borderRadius: 30,
                padding: '44px 46px',
                height: '100%',
                display: 'flex',
                gap: 30,
                alignItems: 'center',
                boxShadow: '0 18px 50px rgba(20,19,26,0.07)',
              }}
            >
              <div
                style={{
                  width: 92,
                  height: 92,
                  borderRadius: 24,
                  background: light.accentSoft,
                  color: light.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="48" height="48" viewBox="0 0 48 48">
                  {ICONS[it.icon]}
                </svg>
              </div>
              <div>
                <div style={{fontSize: 40, fontWeight: 800, color: light.ink, marginBottom: 10}}>{it.title}</div>
                <div style={{fontSize: 26, color: light.sub, lineHeight: 1.5}}>{it.desc}</div>
              </div>
            </div>
          </Rise>
        ))}
      </div>
    </AbsoluteFill>
  </Scene>
);

/* ---------------------------------- 3. 故事演示 ---------------------------------- */

export const StoryScene: React.FC<{
  title: string;
  steps: {day: string; head: string; body: string; tone?: 'normal' | 'highlight'}[];
}> = ({title, steps}) => {
  const frame = useCurrentFrame();
  return (
    <Scene bg="#FBF7F0">
      <AbsoluteFill style={{...shell, padding: '80px 100px 150px'}}>
        <Kicker text="一个长任务的三天" bg="#F6E7CE" color="#B26A00" />
        <div style={{fontSize: 54, fontWeight: 800, color: light.ink, margin: '28px 0 40px'}}>{title}</div>
        <div style={{display: 'flex', gap: 60, flex: 1}}>
          {/* 左：模拟 Agent 会话窗口 */}
          <Rise delay={0} distance={30}>
            <div
              style={{
                width: 780,
                background: light.surface,
                borderRadius: 34,
                padding: 40,
                boxShadow: '0 20px 60px rgba(20,19,26,0.08)',
                height: '100%',
                boxSizing: 'border-box',
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 30}}>
                <div style={{width: 46, height: 46, borderRadius: 14, background: '#EAF1FF'}} />
                <div>
                  <div style={{fontSize: 26, fontWeight: 700, color: light.ink}}>Muse</div>
                  <div style={{fontSize: 20, color: light.faint}}>正在处理 · 保险理赔</div>
                </div>
              </div>
              {steps.map((s, i) => {
                const start = 30 + i * 150;
                const p = interpolate(frame, [start, start + 20], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                });
                return (
                  <div
                    key={i}
                    style={{
                      opacity: p,
                      transform: `translateY(${(1 - p) * 18}px)`,
                      background: s.tone === 'highlight' ? '#EAF1FF' : '#F5F4F1',
                      borderLeft: `5px solid ${s.tone === 'highlight' ? light.accent : '#DDD8CF'}`,
                      borderRadius: 18,
                      padding: '22px 26px',
                      marginBottom: 20,
                      fontSize: 27,
                      lineHeight: 1.5,
                      color: light.ink,
                    }}
                  >
                    <div style={{fontSize: 20, color: light.faint, marginBottom: 8}}>{s.day}</div>
                    {s.body}
                  </div>
                );
              })}
            </div>
          </Rise>
          {/* 右：时间轴 */}
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 46}}>
            {steps.map((s, i) => {
              const start = 30 + i * 150;
              const p = interpolate(frame, [start + 10, start + 30], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              return (
                <div key={i} style={{display: 'flex', gap: 22, opacity: p}}>
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        background: s.tone === 'highlight' ? light.accent : '#D8D3C8',
                      }}
                    />
                    {i < steps.length - 1 ? <div style={{width: 3, flex: 1, background: '#E2DDD2', marginTop: 8}} /> : null}
                  </div>
                  <div>
                    <div style={{fontSize: 34, fontWeight: 800, color: light.ink}}>{s.head}</div>
                    <div style={{fontSize: 24, color: light.sub, marginTop: 6}}>{s.day}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* ---------------------------------- 4. 数字证据 ---------------------------------- */

export const StatScene: React.FC<{
  kicker: string;
  big: {value: number; unit: string; label: string; decimals?: number};
  chips: {label: string; value: string}[];
  note?: string;
}> = ({kicker, big, chips, note}) => (
  <Scene bg={light.bg}>
    <AbsoluteFill style={shell}>
      <Kicker text={kicker} />
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 24}}>
          <div style={{fontFamily: FONT_NUM, fontSize: 260, fontWeight: 800, lineHeight: 0.9, color: light.ink}}>
            <CountUp value={big.value} decimals={big.decimals} duration={22} />
          </div>
          <div style={{fontSize: 70, fontWeight: 700, color: light.accent, paddingBottom: 22}}>{big.unit}</div>
        </div>
        <Rise delay={18}>
          <div style={{fontSize: 42, color: light.sub, marginTop: 18, fontWeight: 600}}>{big.label}</div>
        </Rise>
        <div style={{display: 'flex', gap: 26, marginTop: 54, flexWrap: 'wrap'}}>
          {chips.map((c, i) => (
            <Rise key={i} delay={28 + i * 7} distance={26}>
              <div
                style={{
                  background: light.surface,
                  borderRadius: 22,
                  padding: '26px 40px',
                  boxShadow: '0 10px 30px rgba(20,19,26,0.06)',
                }}
              >
                <div style={{fontSize: 46, fontWeight: 800, color: light.ink, fontFamily: FONT_NUM}}>{c.value}</div>
                <div style={{fontSize: 24, color: light.sub, marginTop: 6}}>{c.label}</div>
              </div>
            </Rise>
          ))}
        </div>
        {note ? (
          <Rise delay={60}>
            <div style={{fontSize: 28, color: light.faint, marginTop: 44}}>{note}</div>
          </Rise>
        ) : null}
      </div>
    </AbsoluteFill>
  </Scene>
);

/* ---------------------------------- 5. 对比条 ---------------------------------- */

export const CompareScene: React.FC<{
  kicker: string;
  title: string;
  rows: {name: string; value: number; color: string; suffix?: string}[];
  footnote?: string;
}> = ({kicker, title, rows, footnote}) => {
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <Scene bg={light.bg}>
      <AbsoluteFill style={shell}>
        <Kicker text={kicker} />
        <Rise delay={8}>
          <div style={{fontSize: 56, fontWeight: 800, color: light.ink, margin: '30px 0 50px'}}>{title}</div>
        </Rise>
        <div style={{display: 'flex', flexDirection: 'column', gap: 44, flex: 1, justifyContent: 'center'}}>
          {rows.map((r, i) => (
            <div key={i}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16}}>
                <div style={{fontSize: 38, fontWeight: 700, color: light.ink}}>{r.name}</div>
                <div style={{fontSize: 52, fontWeight: 800, color: r.color, fontFamily: FONT_NUM}}>
                  <CountUp value={r.value} decimals={1} delay={20 + i * 12} suffix={r.suffix ?? '%'} />
                </div>
              </div>
              <GrowBar to={(r.value / max) * 100} delay={20 + i * 12} color={r.color} height={34} />
            </div>
          ))}
        </div>
        {footnote ? (
          <Rise delay={70}>
            <div style={{fontSize: 25, color: light.faint, marginTop: 30}}>{footnote}</div>
          </Rise>
        ) : null}
      </AbsoluteFill>
    </Scene>
  );
};

/* ---------------------------------- 6. 概念对分 ---------------------------------- */

export const SplitScene: React.FC<{
  kicker: string;
  left: {title: string; sub: string; points: string[]; color: string};
  right: {title: string; sub: string; points: string[]; color: string};
}> = ({kicker, left, right}) => (
  <Scene bg={light.bg}>
    <AbsoluteFill style={shell}>
      <Kicker text={kicker} />
      <div style={{flex: 1, display: 'flex', gap: 44, alignItems: 'stretch', marginTop: 40}}>
        {[left, right].map((side, i) => (
          <Rise key={i} delay={i * 10} distance={40} style={{flex: 1, display: 'flex'}}>
            <div
              style={{
                flex: 1,
                background: light.surface,
                borderRadius: 34,
                padding: 54,
                boxShadow: '0 18px 50px rgba(20,19,26,0.07)',
                borderTop: `8px solid ${side.color}`,
              }}
            >
              <div style={{fontSize: 46, fontWeight: 800, color: side.color, fontFamily: FONT_NUM}}>{side.title}</div>
              <div style={{fontSize: 27, color: light.sub, marginTop: 10, marginBottom: 34}}>{side.sub}</div>
              {side.points.map((p, j) => (
                <Rise key={j} delay={20 + i * 10 + j * 6} distance={18}>
                  <div style={{display: 'flex', gap: 16, marginBottom: 20, alignItems: 'flex-start'}}>
                    <div style={{width: 12, height: 12, borderRadius: 6, background: side.color, marginTop: 14, flexShrink: 0}} />
                    <div style={{fontSize: 30, color: light.ink, lineHeight: 1.5}}>{p}</div>
                  </div>
                </Rise>
              ))}
            </div>
          </Rise>
        ))}
      </div>
    </AbsoluteFill>
  </Scene>
);

/* ---------------------------------- 7. 接入卡片 ---------------------------------- */

export const CardRow: React.FC<{
  kicker: string;
  title: string;
  cards: {head: string; body: string; tag?: string; tone?: 'accent' | 'plain' | 'warn'}[];
}> = ({kicker, title, cards}) => (
  <Scene bg={light.bg}>
    <AbsoluteFill style={shell}>
      <Kicker text={kicker} />
      <Rise delay={8}>
        <div style={{fontSize: 54, fontWeight: 800, color: light.ink, margin: '30px 0 46px'}}>{title}</div>
      </Rise>
      <div style={{flex: 1, display: 'flex', gap: 34, alignItems: 'stretch'}}>
        {cards.map((c, i) => (
          <Rise key={i} delay={16 + i * 8} distance={40} style={{flex: 1, display: 'flex'}}>
            <div
              style={{
                flex: 1,
                background: c.tone === 'accent' ? light.accent : light.surface,
                color: c.tone === 'accent' ? '#fff' : light.ink,
                borderRadius: 30,
                padding: 46,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 18px 50px rgba(20,19,26,0.08)',
              }}
            >
              <div>
                <div style={{fontSize: 36, fontWeight: 800, marginBottom: 16}}>{c.head}</div>
                <div style={{fontSize: 26, lineHeight: 1.6, opacity: c.tone === 'accent' ? 0.92 : 1}}>{c.body}</div>
              </div>
              {c.tag ? (
                <div
                  style={{
                    marginTop: 30,
                    alignSelf: 'flex-start',
                    fontSize: 22,
                    padding: '8px 18px',
                    borderRadius: 999,
                    background: c.tone === 'accent' ? 'rgba(255,255,255,0.22)' : '#F0EEE9',
                  }}
                >
                  {c.tag}
                </div>
              ) : null}
            </div>
          </Rise>
        ))}
      </div>
    </AbsoluteFill>
  </Scene>
);

/* ---------------------------------- 8. 深蓝安全图纸 ---------------------------------- */

export const BlueprintScene: React.FC<{
  title: string;
  steps: {no: string; head: string; body: string; tone?: 'ok' | 'warn' | 'pending'}[];
}> = ({title, steps}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const per = Math.max(1, Math.floor((durationInFrames - 60) / steps.length));
  return (
    <Scene bg={blueprint.bg} overlay={gridBackground()}>
      <AbsoluteFill style={{...shell, padding: '80px 110px 150px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 46}}>
          <div style={{width: 14, height: 44, background: blueprint.accent, borderRadius: 3}} />
          <div style={{fontSize: 46, fontWeight: 800, color: blueprint.ink, letterSpacing: 2}}>{title}</div>
          <div
            style={{
              marginLeft: 'auto',
              fontSize: 22,
              color: blueprint.sub,
              border: `1px solid ${blueprint.line}`,
              padding: '8px 18px',
              borderRadius: 6,
              letterSpacing: 1,
            }}
          >
            SECURITY DESIGN · 01
          </div>
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 22}}>
          {steps.map((s, i) => {
            const start = 20 + i * per;
            const p = interpolate(frame, [start, start + 18], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const toneColor =
              s.tone === 'ok' ? blueprint.ok : s.tone === 'warn' ? blueprint.warn : blueprint.accent;
            return (
              <div key={i} style={{display: 'flex', gap: 26, opacity: p, transform: `translateX(${(1 - p) * -30}px)`}}>
                <div
                  style={{
                    width: 74,
                    height: 74,
                    flexShrink: 0,
                    borderRadius: 12,
                    border: `2px solid ${toneColor}`,
                    color: toneColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: FONT_NUM,
                    fontSize: 30,
                    fontWeight: 800,
                    background: 'rgba(78,168,255,0.07)',
                  }}
                >
                  {s.no}
                </div>
                <div
                  style={{
                    flex: 1,
                    border: `1px solid ${blueprint.line}`,
                    background: 'rgba(18,39,69,0.55)',
                    borderRadius: 14,
                    padding: '20px 34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 24,
                  }}
                >
                  <div>
                    <div style={{fontSize: 34, fontWeight: 700, color: blueprint.ink}}>{s.head}</div>
                    <div style={{fontSize: 23, color: blueprint.sub, marginTop: 8, lineHeight: 1.5}}>{s.body}</div>
                  </div>
                  {s.tone === 'pending' ? (
                    <div
                      style={{
                        flexShrink: 0,
                        border: `2px dashed ${blueprint.warn}`,
                        color: blueprint.warn,
                        padding: '10px 22px',
                        borderRadius: 8,
                        fontSize: 24,
                        fontWeight: 700,
                        transform: 'rotate(-6deg)',
                      }}
                    >
                      即将发布
                    </div>
                  ) : (
                    <div style={{flexShrink: 0, width: 16, height: 16, borderRadius: 8, background: toneColor}} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* ---------------------------------- 9. 局限三卡 ---------------------------------- */

export const LimitScene: React.FC<{
  kicker: string;
  items: {head: string; body: string}[];
}> = ({kicker, items}) => (
  <Scene bg={light.bg}>
    <AbsoluteFill style={shell}>
      <Kicker text={kicker} bg="#FBE3E3" color={light.warn} />
      <div style={{flex: 1, display: 'flex', gap: 34, alignItems: 'center'}}>
        {items.map((it, i) => (
          <Rise key={i} delay={10 + i * 9} distance={40} style={{flex: 1, display: 'flex'}}>
            <div
              style={{
                flex: 1,
                background: light.surface,
                borderRadius: 30,
                padding: 48,
                borderTop: `8px solid ${light.warn}`,
                boxShadow: '0 18px 50px rgba(20,19,26,0.07)',
              }}
            >
              <div style={{fontSize: 30, fontWeight: 800, color: light.warn, fontFamily: FONT_NUM, marginBottom: 18}}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{fontSize: 38, fontWeight: 800, color: light.ink, marginBottom: 16, lineHeight: 1.3}}>
                {it.head}
              </div>
              <div style={{fontSize: 26, color: light.sub, lineHeight: 1.6}}>{it.body}</div>
            </div>
          </Rise>
        ))}
      </div>
    </AbsoluteFill>
  </Scene>
);

/* ---------------------------------- 10. 来源卡 ---------------------------------- */

export const SourceScene: React.FC<{title: string; sources: string[]; disclaimer: string}> = ({
  title,
  sources,
  disclaimer,
}) => (
  <Scene bg={light.bg}>
    <AbsoluteFill style={{...shell, justifyContent: 'center'}}>
      <Rise delay={0} distance={24}>
        <div style={{fontSize: 44, fontWeight: 800, color: light.ink, marginBottom: 36}}>{title}</div>
      </Rise>
      {sources.map((s, i) => (
        <Rise key={i} delay={10 + i * 8} distance={22}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              background: light.surface,
              borderRadius: 18,
              padding: '22px 32px',
              marginBottom: 16,
              fontSize: 29,
              color: light.ink,
              boxShadow: '0 8px 24px rgba(20,19,26,0.05)',
            }}
          >
            <span style={{width: 10, height: 10, borderRadius: 5, background: light.accent}} />
            {s}
          </div>
        </Rise>
      ))}
      <Rise delay={50}>
        <div style={{fontSize: 24, color: light.faint, marginTop: 34, lineHeight: 1.6}}>{disclaimer}</div>
      </Rise>
    </AbsoluteFill>
  </Scene>
);

export const FONT_STYLE_CN = FONT_CN;
