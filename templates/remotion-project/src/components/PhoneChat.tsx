import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT_CN, FONT_NUM, light, gridBackground} from '../theme';
import {Rise, Scene} from './primitives';

/**
 * 贯穿母题：手机聊天界面模拟。
 * 精髓是「产品在现场」——故事不用卡片讲，用一段真实感的对话讲：
 * 消息气泡按解说节奏弹出、AI 主动发来进展、关键动作弹确认卡。
 * 消息时间以「镜头内相对秒」配置，与 cue 时间码对齐。
 */

const PHONE_W = 440;
const PHONE_H = 900;

/** 气泡入场：从下方滑入 + 弹性 */
const usePop = (atSec: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({
    frame: frame - atSec * fps,
    fps,
    config: {damping: 14, mass: 0.5},
    durationInFrames: 16,
  });
  return {
    opacity: p,
    transform: `translateY(${(1 - p) * 26}px) scale(${0.94 + p * 0.06})`,
  };
};

const Avatar: React.FC<{size?: number}> = ({size = 52}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: `linear-gradient(135deg, ${light.accent}, #6C5CE7)`,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: FONT_NUM,
      fontWeight: 800,
      fontSize: size * 0.42,
      flexShrink: 0,
    }}
  >
    M
  </div>
);

const TypingDots: React.FC<{atSec: number; untilSec: number}> = ({atSec, untilSec}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = usePop(atSec);
  const gone = frame >= untilSec * fps;
  if (gone) return null;
  return (
    <div style={{display: 'flex', gap: 10, alignItems: 'flex-end', ...pop}}>
      <Avatar size={40} />
      <div
        style={{
          background: '#fff',
          borderRadius: '4px 22px 22px 22px',
          padding: '18px 22px',
          display: 'flex',
          gap: 7,
          boxShadow: '0 2px 10px rgba(20,19,26,0.07)',
        }}
      >
        {[0, 1, 2].map((i) => {
          const t = Math.max(0, Math.sin(((frame - atSec * fps) / 8) - i * 0.9));
          return (
            <span
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                background: light.faint,
                opacity: 0.35 + t * 0.65,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------ 消息内嵌卡片 ------------------------------ */

const TaskCard: React.FC = () => {
  const rows = [
    {label: '比对保单条款', tone: 'ok' as const},
    {label: '标记缺失：事故证明', tone: 'warn' as const},
    {label: '继续计算可赔金额', tone: 'ok' as const},
  ];
  return (
    <div style={{marginTop: 12, background: '#F6F8FC', borderRadius: 14, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 9}}>
      {rows.map((r, i) => (
        <div key={i} style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 21, color: light.ink, fontWeight: 500}}>
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              fontWeight: 800,
              color: '#fff',
              background: r.tone === 'ok' ? light.ok : light.warm,
            }}
          >
            {r.tone === 'ok' ? '✓' : '!'}
          </span>
          {r.label}
        </div>
      ))}
    </div>
  );
};

const CiteCard: React.FC = () => (
  <div style={{marginTop: 12, border: `1.5px solid ${light.accentSoft}`, background: '#FBFDFF', borderRadius: 14, padding: '14px 18px', fontSize: 21, color: light.ink, display: 'flex', gap: 10, alignItems: 'center'}}>
    <span style={{fontSize: 24}}>📄</span>
    <div>
      <div style={{fontWeight: 700}}>免赔额条款 · ¥2,000</div>
      <div style={{fontSize: 17, color: light.sub, marginTop: 2}}>来自 DAY 1 的对话记录</div>
    </div>
  </div>
);

const ConfirmCard: React.FC<{atSec: number; acceptAtSec: number}> = ({atSec, acceptAtSec}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = usePop(atSec);
  const accepted = frame >= acceptAtSec * fps;
  return (
    <div
      style={{
        ...pop,
        alignSelf: 'flex-start',
        maxWidth: '86%',
        background: '#fff',
        border: '1.5px solid #ECE9E2',
        borderRadius: 20,
        padding: '20px 22px',
        boxShadow: '0 4px 18px rgba(20,19,26,0.08)',
      }}
    >
      <div style={{fontSize: 15, fontWeight: 800, letterSpacing: 2, color: light.warm, marginBottom: 8}}>需要你确认</div>
      <div style={{fontSize: 22, fontWeight: 600, color: light.ink, lineHeight: 1.5}}>把补充材料邮件发给保险公司？</div>
      <div style={{display: 'flex', gap: 12, marginTop: 16}}>
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '13px 0',
            borderRadius: 12,
            fontSize: 21,
            fontWeight: 700,
            background: accepted ? light.accent : '#F1EFEA',
            color: accepted ? '#fff' : light.sub,
            transition: 'none',
          }}
        >
          {accepted ? '✓ 已允许发送' : '允许发送'}
        </div>
        <div style={{padding: '13px 22px', borderRadius: 12, fontSize: 21, color: light.faint}}>先不发</div>
      </div>
    </div>
  );
};

/* ------------------------------ 消息气泡 ------------------------------ */

type Msg =
  | {kind: 'user'; at: number; text: string; attach?: string}
  | {kind: 'ai'; at: number; text: string; card?: 'task' | 'cite'}
  | {kind: 'typing'; at: number; until: number}
  | {kind: 'confirm'; at: number; acceptAt: number};

const Bubble: React.FC<{m: Msg}> = ({m}) => {
  if (m.kind === 'typing') {
    return <TypingDots atSec={m.at} untilSec={m.until} />;
  }
  if (m.kind === 'confirm') {
    return <ConfirmCard atSec={m.at} acceptAtSec={m.acceptAt} />;
  }
  const pop = usePop(m.at);
  const isUser = m.kind === 'user';
  return (
    <div
      style={{
        ...pop,
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '86%',
        display: 'flex',
        gap: 10,
        alignItems: 'flex-end',
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
    >
      {!isUser && <Avatar size={40} />}
      <div>
        <div
          style={{
            background: isUser ? light.accent : '#fff',
            color: isUser ? '#fff' : light.ink,
            borderRadius: isUser ? '22px 4px 22px 22px' : '4px 22px 22px 22px',
            padding: '16px 20px',
            fontSize: 22,
            lineHeight: 1.5,
            fontWeight: 500,
            boxShadow: '0 2px 10px rgba(20,19,26,0.07)',
          }}
        >
          {m.text}
        </div>
        {m.kind === 'ai' && m.card === 'task' && <TaskCard />}
        {m.kind === 'ai' && m.card === 'cite' && <CiteCard />}
        {m.kind === 'user' && m.attach && (
          <div style={{marginTop: 8, background: 'rgba(10,48,120,0.45)', borderRadius: 10, padding: '8px 14px', fontSize: 17, color: '#fff', fontWeight: 600}}>
            📎 {m.attach}
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------------------ 手机外壳 ------------------------------ */

export const PhoneMockup: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      width: PHONE_W,
      height: PHONE_H,
      borderRadius: 54,
      background: '#101018',
      padding: 14,
      boxShadow: '0 30px 80px rgba(20,19,26,0.28)',
      flexShrink: 0,
      ...style,
    }}
  >
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 42,
        background: '#F4F3EF',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: FONT_CN,
      }}
    >
      {children}
    </div>
  </div>
);

export const StatusBar: React.FC = () => (
  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 26px 8px', fontFamily: FONT_NUM, fontSize: 19, fontWeight: 700, color: light.ink}}>
    <span>9:41</span>
    <span style={{display: 'flex', gap: 6, alignItems: 'center'}}>
      <span style={{width: 18, height: 11, borderRadius: 3, background: light.ink, display: 'inline-block'}} />
      <span style={{width: 24, height: 12, border: '1.5px solid ' + light.ink, borderRadius: 4, display: 'inline-flex', alignItems: 'center', padding: 1.5}}>
        <span style={{height: '100%', width: '70%', background: light.ok, borderRadius: 1.5}} />
      </span>
    </span>
  </div>
);

/* ------------------------------ 聊天故事场景 ------------------------------ */

/**
 * 故事段：保险理赔跨三天，全程用对话讲。
 * 消息时间（相对镜头秒）与 cue02-04 对齐：
 * cue02 rel≈0.4s（用户上传） cue03 rel≈5.8s（AI 主动跟进） cue04 rel≈12.4s（引用上周条款）
 */
const CHAT_MSGS: Msg[] = [
  {kind: 'user', at: 0.4, text: '这是保单、医疗记录和这周的邮件。', attach: '保单.pdf · 医疗记录.pdf · 12 封邮件'},
  {kind: 'user', at: 4.5, text: '我这种情况能赔多少？'},
  {kind: 'typing', at: 9.5, until: 13.3},
  {kind: 'ai', at: 13.3, text: '条款比对完成。发现缺少一份事故证明，我先记下了，不耽误估算。', card: 'task'},
  {kind: 'ai', at: 22.0, text: '你上周提过的免赔额条款，我已经用在这次计算里。', card: 'cite'},
  {kind: 'confirm', at: 30.2, acceptAt: 34.3},
];

/** 右侧步骤标注随解说切换 */
const STEPS = [
  {from: 0.1, day: 'DAY 1', head: '你把材料丢给它'},
  {from: 13.3, day: 'DAY 2', head: '它自己接着查'},
  {from: 22.0, day: 'DAY 3', head: '带回上周的条款'},
  {from: 30.2, day: 'DAY 3 · 卡住', head: '换路径，先问你'},
];

export const ChatScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const step = [...STEPS].reverse().find((s) => t >= s.from) ?? STEPS[0];

  // 手机入场：整个 mockup 从右侧滑入
  const enter = spring({frame, fps, config: {damping: 200, mass: 0.5}, durationInFrames: 20});

  return (
    <Scene bg={light.bg}>
      <AbsoluteFill style={{...gridBackground('#E9E5DC', 56), opacity: 0.5}} />
      <AbsoluteFill style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 90, padding: '60px 120px', fontFamily: FONT_CN}}>
        <div style={{transform: `translateX(${(1 - enter) * 140}px)`, opacity: enter}}>
          <PhoneMockup>
            <StatusBar />
            {/* 对话头 */}
            <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 22px 14px', borderBottom: '1px solid #E8E4DC'}}>
              <Avatar size={46} />
              <div>
                <div style={{fontSize: 24, fontWeight: 800, color: light.ink}}>Muse</div>
                <div style={{fontSize: 16, color: light.ok, fontWeight: 600}}>主动为你跟进中</div>
              </div>
            </div>
            {/* 消息流 */}
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 14, padding: '18px 18px 12px', overflow: 'hidden'}}>
              {CHAT_MSGS.map((m, i) => (
                <Bubble key={i} m={m} />
              ))}
            </div>
            {/* 输入栏 */}
            <div style={{padding: '12px 18px 26px'}}>
              <div style={{background: '#fff', borderRadius: 24, padding: '14px 20px', fontSize: 19, color: light.faint, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span>输入消息…</span>
                <span style={{width: 34, height: 34, borderRadius: 17, background: light.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18}}>↑</span>
              </div>
            </div>
          </PhoneMockup>
        </div>
        {/* 右侧步骤标注 */}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 640}}>
          <Rise key={step.day} delay={0} distance={18}>
            <div style={{display: 'inline-flex', alignSelf: 'flex-start', background: light.ink, color: '#fff', fontFamily: FONT_NUM, fontSize: 26, fontWeight: 800, letterSpacing: 3, padding: '10px 24px', borderRadius: 10}}>
              {step.day}
            </div>
          </Rise>
          <Rise key={step.head} delay={3} distance={24}>
            <div style={{fontSize: 74, fontWeight: 800, color: light.ink, lineHeight: 1.3, marginTop: 30, letterSpacing: -1}}>
              {step.head}
            </div>
          </Rise>
          <Rise delay={8} distance={20}>
            <div style={{marginTop: 34, fontSize: 30, color: light.sub, lineHeight: 1.7}}>
              对话还在继续——它没有停在原地等你追问。
            </div>
          </Rise>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

/* ------------------------------ 开场气泡（标题卡用） ------------------------------ */

/** 标题卡右侧的 mini 手机：一条 AI 气泡主动弹出，演示「它来找你」 */
export const TitlePhoneBurst: React.FC = () => {
  const {fps} = useVideoConfig();
  const enter = spring({frame: useCurrentFrame() - 20, fps, config: {damping: 200, mass: 0.5}, durationInFrames: 22});
  return (
    <div
      style={{
        transform: `translateX(${(1 - enter) * 120}px) scale(${0.62})`,
        transformOrigin: 'center right',
        opacity: enter,
      }}
    >
      <PhoneMockup>
        <StatusBar />
        <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '8px 20px 12px', borderBottom: '1px solid #E8E4DC'}}>
          <Avatar size={40} />
          <div style={{fontSize: 21, fontWeight: 800, color: light.ink}}>Muse</div>
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 12, padding: 16}}>
          <Bubble m={{kind: 'user', at: 1.6, text: '帮我盯着理赔的进展'}} />
          <Bubble m={{kind: 'ai', at: 3.4, text: '好。有新进展我会主动来找你。'}} />
          <Bubble m={{kind: 'ai', at: 5.6, text: '你的理赔有新进展，我拿来给你 →'}} />
        </div>
      </PhoneMockup>
    </div>
  );
};
