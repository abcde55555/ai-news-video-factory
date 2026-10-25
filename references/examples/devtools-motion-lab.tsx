import React from 'react';
import {AbsoluteFill, interpolate, Sequence, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * 动效试验片：给 REA（逆向工程）题材设计的三组"抓眼"动效。
 * 设计原则：不靠炫技，靠**"乱码变人话"这个过程本身**制造注意力——
 * 因为这就是产品在做的事，动效即论证。
 */

const BG = '#0D1117';
const PANEL = '#161B22';
const LINE = '#30363D';
const INK = '#E6EDF3';
const DIM = '#6E7681';
const GREEN = '#3FB950';
const BLUE = '#58A6FF';
const AMBER = '#D29922';
const RED = '#F85149';
const MONO = '"SF Mono", "JetBrains Mono", Menlo, monospace';

/** 字符串 → 稳定数字种子（Remotion 的 random 只接受 number） */
const hash = (str: string) => {
  let h = 7;
  for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) % 999983;
  return h;
};

const hex = (seed: string, len: number) => {
  const chars = '0123456789ABCDEF';
  let out = '';
  for (let i = 0; i < len; i += 1) out += chars[Math.floor(random(hash(`${seed}-${i}`)) * 16)];
  return out;
};

/* ---------------- 1. 十六进制流 + 扫描线锁定 ---------------- */

const HexScan: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const COLS = 14;
  const ROWS = 26;

  const scanY = interpolate(frame, [4, 58], [-140, 1000], {extrapolateRight: 'clamp'});
  const lockIn = spring({frame: frame - 54, fps, config: {damping: 13, mass: 0.55}});
  const lock = {x: 0.5, y: 0.42};

  return (
    <AbsoluteFill style={{backgroundColor: BG, overflow: 'hidden'}}>
      {/* 字节流网格 */}
      {Array.from({length: COLS}).map((_, c) => {
        const speed = 0.5 + random(hash(`col${c}`)) * 2.2;
        const drift = (frame * speed) % 120;
        return (
          <div
            key={c}
            style={{
              position: 'absolute',
              left: 108 + c * 122,
              top: -120 + drift,
              fontFamily: MONO,
              fontSize: 19,
              lineHeight: '34px',
              letterSpacing: 1.5,
              color: DIM,
            }}
          >
            {Array.from({length: ROWS}).map((__, r) => {
              const y = -120 + drift + r * 34;
              // 扫描线附近点亮
              const d = Math.abs(y - scanY);
              const lit = Math.max(0, 1 - d / 120);
              const isLocked =
                Math.abs(y - 1080 * lock.y) < 17 && Math.abs(108 + c * 122 - 1920 * lock.x) < 70;
              return (
                <div
                  key={r}
                  style={{
                    color: isLocked ? GREEN : lit > 0.55 ? BLUE : DIM,
                    opacity: isLocked ? 1 : 0.25 + lit * 0.75,
                    fontWeight: isLocked ? 700 : 400,
                  }}
                >
                  {hex(`${c}-${r}-${Math.floor((frame + r * 7) / 9)}`, 4)}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* 扫描线 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: '100%',
          top: scanY,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${BLUE}, ${GREEN}, transparent)`,
          boxShadow: `0 0 42px 10px rgba(88,166,255,0.35)`,
          opacity: frame < 58 ? 1 : 0.25,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: '100%',
          top: scanY - 90,
          height: 90,
          background: 'linear-gradient(180deg, transparent, rgba(88,166,255,0.06))',
          opacity: frame < 58 ? 1 : 0,
        }}
      />

      {/* 锁定标注 */}
      {lockIn > 0.02 ? (
        <div
          style={{
            position: 'absolute',
            left: 1920 * lock.x - 120,
            top: 1080 * lock.y - 56,
            width: 260,
            height: 96,
            border: `2px solid ${GREEN}`,
            borderRadius: 6,
            background: 'rgba(13,17,23,0.97)',
            transform: `scale(${0.8 + lockIn * 0.2})`,
            opacity: lockIn,
            boxShadow: `0 0 30px rgba(63,185,80,0.45)`,
            fontFamily: MONO,
            padding: '10px 14px',
          }}
        >
          <div style={{fontSize: 15, color: DIM, letterSpacing: 1.5}}>BYTE @ 0x100004A70</div>
          <div style={{fontSize: 30, color: GREEN, fontWeight: 700, marginTop: 2}}>0x4A 0x7D 0xBE</div>
          <div style={{fontSize: 14, color: BLUE, marginTop: 2}}>→ string literal</div>
        </div>
      ) : null}

      {/* 标题 */}
      <div style={{position: 'absolute', left: 108, bottom: 72, fontFamily: MONO, fontSize: 22, color: DIM, letterSpacing: 2}}>
        <span style={{color: GREEN}}>01</span>  SCAN · 从字节里读出东西
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 2. 反编译：汇编重排成 C ---------------- */

const ASM = [
  'mov     rax, [rbp-0x18]',
  'test    rax, rax',
  'je      0x100004b2c',
  'lea     rdi, [rip+0x2f1]',
  'call    0x100003f80',
  'xor     ecx, ecx',
  'mov     [rbx+0x8], rax',
  'cmp     dword [rbx], 0x3',
];
const CCODE = [
  'int parse_header(FILE *f) {',
  '  if (!f) return -1;',
  '  const char *sig = read_sig(f);',
  '  if (!sig) return -2;',
  '  hdr->count = 0;',
  '  hdr->chunk = sig;',
  '  return hdr->count == 3 ? 0 : -3;',
  '}',
];

const Decompile: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const freeze = 26;          // 定格帧
  const glitch = frame >= freeze && frame < freeze + 10;
  const swapStart = freeze + 8;

  return (
    <AbsoluteFill style={{backgroundColor: BG, padding: '88px 110px', fontFamily: MONO}}>
      {/* 抖动容器 */}
      <div style={{transform: glitch ? `translateX(${(random(hash(`g${frame}`)) - 0.5) * 26}px)` : 'none', flex: 1}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26}}>
          <span style={{width: 10, height: 10, borderRadius: 5, background: frame >= swapStart ? GREEN : AMBER}} />
          <span style={{fontSize: 20, color: DIM, letterSpacing: 2}}>
            {frame >= swapStart ? 'RECONSTRUCTED C SOURCE' : 'DISASSEMBLY · 0x100004A70'}
          </span>
        </div>

        <div style={{position: 'relative', background: PANEL, border: `1px solid ${LINE}`, borderRadius: 10, padding: '28px 34px', minHeight: 480}}>
          {/* 汇编层：滚动 → 定格 → 逐行退场 */}
          <div style={{position: 'absolute', left: 34, top: 28, right: 34}}>
            {ASM.map((line, i) => {
              const scrollY = frame < freeze ? (frame * 7) % 40 : 0;
              // 整体清空：swapStart 起 8 帧内 opacity 1→0 并上滑
              const out = interpolate(frame, [swapStart, swapStart + 8], [1, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              return (
                <div
                  key={i}
                  style={{
                    fontSize: 27,
                    lineHeight: '52px',
                    color: DIM,
                    transform: `translateY(${scrollY - (1 - out) * 26}px)`,
                    opacity: out,
                    whiteSpace: 'pre',
                  }}
                >
                  <span style={{color: '#3D4650', marginRight: 22}}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{color: DIM}}>{line}</span>
                </div>
              );
            })}
          </div>

          {/* C 代码层：逐行浮入 */}
          <div style={{position: 'absolute', left: 34, top: 28, right: 34}}>
            {CCODE.map((line, i) => {
              const start = swapStart + 10 + i * 5;
              const p = spring({frame: frame - start, fps, config: {damping: 200, mass: 0.5}, durationInFrames: 14});
              return (
                <div
                  key={i}
                  style={{
                    fontSize: 27,
                    lineHeight: '52px',
                    color: INK,
                    opacity: p,
                    transform: `translateY(${(1 - p) * 16}px)`,
                    whiteSpace: 'pre',
                  }}
                >
                  <span style={{color: '#3D4650', marginRight: 22}}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{color: /int|return|const|if/.test(line) ? BLUE : INK}}>{line}</span>
                </div>
              );
            })}
          </div>

          {/* 扫描完成提示 */}
          {frame > swapStart + 52 ? (
            <div style={{position: 'absolute', right: 34, bottom: 26, fontFamily: MONO, fontSize: 22, color: GREEN}}>
              ✓ 重建完成 · 字节级一致
            </div>
          ) : null}
        </div>
      </div>

      <div style={{fontFamily: MONO, fontSize: 22, color: DIM, letterSpacing: 2, marginTop: 26}}>
        <span style={{color: GREEN}}>02</span>  RECONSTRUCT · 乱码变人话
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 3. 字节对齐校验 ---------------- */

const ByteDiff: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ROWS = 10;
  const PER = 14;

  const total = ROWS * PER;
  // 从第 12 帧开始逐字节校验，每 1.1 帧一个
  const checked = Math.max(0, Math.min(total, Math.floor((frame - 10) / 0.72)));
  const pct = checked / total;

  return (
    <AbsoluteFill style={{backgroundColor: BG, padding: '80px 110px', fontFamily: MONO}}>
      <div style={{display: 'flex', gap: 60, flex: 1}}>
        {['ORIGINAL · x86', 'RECONSTRUCTED'].map((label, side) => (
          <div key={side} style={{flex: 1, background: PANEL, border: `1px solid ${LINE}`, borderRadius: 10, padding: '24px 26px'}}>
            <div style={{fontSize: 18, color: DIM, letterSpacing: 2, marginBottom: 18}}>{label}</div>
            {Array.from({length: ROWS}).map((_, r) => (
              <div key={r} style={{display: 'flex', gap: 10, marginBottom: 12, alignItems: 'center'}}>
                <span style={{fontSize: 15, color: '#3D4650', width: 74}}>{`0x${(0x4a70 + r * 16).toString(16).toUpperCase()}`}</span>
                {Array.from({length: PER}).map((__, c) => {
                  const idx = r * PER + c;
                  const done = idx < checked;
                  const diff = random(hash(`d${r}-${c}`)) > 0.72; // 少量"差异"用于演示对齐
                  const color = !done ? '#2E353D' : side === 0 ? (diff ? AMBER : '#8B949E') : diff ? AMBER : GREEN;
                  return (
                    <span
                      key={c}
                      style={{
                        fontSize: 18,
                        color,
                        width: 26,
                        textAlign: 'center',
                        transition: 'none',
                        fontWeight: done && idx === checked - 1 ? 700 : 400,
                        background: done && idx === checked - 1 ? 'rgba(63,185,80,0.18)' : 'transparent',
                      }}
                    >
                      {hex(`${r}-${c}`, 2)}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 进度 + 计数器 */}
      <div style={{marginTop: 30, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
        <div style={{flex: 1, maxWidth: 1020}}>
          <div style={{height: 8, background: '#1F262E', borderRadius: 4, overflow: 'hidden'}}>
            <div style={{width: `${pct * 100}%`, height: '100%', background: `linear-gradient(90deg, ${BLUE}, ${GREEN})`}} />
          </div>
          <div style={{marginTop: 12, fontSize: 20, color: DIM, letterSpacing: 1.5}}>
            逐字节比对中 · 差异处标为琥珀
          </div>
        </div>
        <div style={{textAlign: 'right', marginLeft: 60}}>
          <div style={{fontSize: 66, fontWeight: 800, color: checked >= total ? GREEN : INK, fontFamily: '"Helvetica Neue", Arial'}}>
            {checked}
            <span style={{fontSize: 30, color: DIM}}> / {total}</span>
          </div>
          <div style={{fontSize: 20, color: DIM, marginTop: 2}}>bytes verified</div>
        </div>
      </div>

      <div style={{fontFamily: MONO, fontSize: 22, color: DIM, letterSpacing: 2, marginTop: 22}}>
        <span style={{color: GREEN}}>03</span>  VERIFY · 逐字节对得上，才算真的
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- 试验片总装 ---------------- */

export const MotionLab: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: BG}}>
    <Sequence from={0} durationInFrames={90}>
      <HexScan />
    </Sequence>
    <Sequence from={90} durationInFrames={90}>
      <Decompile />
    </Sequence>
    <Sequence from={180} durationInFrames={90}>
      <ByteDiff />
    </Sequence>
  </AbsoluteFill>
);
