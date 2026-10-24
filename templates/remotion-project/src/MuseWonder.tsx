import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {fade} from '@remotion/transitions/fade';
import {content} from './data/museWonder';
import {DURATION, cues, shots} from './data/timeline';
import type {Shot} from './data/timeline';
import {SubtitleTrack} from './components/SubtitleTrack';
import {AudioTrack} from './components/AudioTrack';
import {ChatScene} from './components/PhoneChat';
import {BrandMark, ChapterPage, KenBurns} from './components/detail';
import {
  BlueprintScene,
  CardRow,
  CompareScene,
  FourGrid,
  LimitScene,
  SourceScene,
  SplitScene,
  StatScene,
  TitleCard,
} from './components/scenes';
import {FPS} from './theme';

const s = (sec: number) => Math.round(sec * FPS);

/**
 * 镜头内容映射。时间轴（shots/cues）由 build_timeline.py 按节奏基准生成：
 * 单条字幕 ~3.2s / ~20 字、语速 ~5.1 字/秒、页数 19、总时长 4:12。
 */
const STATS = {statContext: content.statContext, statPrice: content.statPrice};
const COMPARES = {compareLegal: content.compareLegal, compareCode: content.compareCode};

const nodeFor = (shot: Shot): React.ReactNode => {
  switch (shot.id) {
    case 'title':
      return <TitleCard />;
    case 'chapter':
      return <ChapterPage title={shot.prop ?? ''} />;
    case 'four':
      return <FourGrid items={content.fourGrid} />;
    case 'chat':
      return <ChatScene />;
    case 'stat': {
      const key = shot.prop as keyof typeof STATS;
      return <StatScene {...STATS[key]} />;
    }
    case 'compare': {
      const key = shot.prop as keyof typeof COMPARES;
      return <CompareScene {...COMPARES[key]} />;
    }
    case 'split':
      return <SplitScene kicker={content.split.kicker} left={content.split.left} right={content.split.right} />;
    case 'cards':
      return shot.prop === 'train' ? (
        <CardRow kicker="训练与验证" title="在吉瓦级数据中心训练" cards={[
          {head: 'Prometheus', body: '吉瓦规模的训练设施，Meta 自研算力底座。', tag: '训练地', tone: 'accent'},
          {head: 'FocusBench', body: '衡量模型在困难任务上的持续推进能力。', tag: '评估', tone: 'plain'},
          {head: 'SWE-Marathon', body: '检验长时间软件项目的持续执行表现。', tag: '评估', tone: 'plain'},
        ]} />
      ) : (
        <CardRow {...content.access} />
      );
    case 'blueprint':
      return <BlueprintScene title={content.blueprint.title} steps={content.blueprint.steps} />;
    case 'limits':
      return <LimitScene {...content.limits} />;
    case 'source':
      return <SourceScene {...content.source} />;
    default:
      return null;
  }
};

/** 转场：原片 80% 硬切 + 20% 推近/滑入；这里只在章节页切换处做滑动，其余用短淡入 */
const TRANS_S = 0.5;
const needsTransition = (shot: Shot) => shot.enter !== 'none' && shot.id === 'chapter';
const presentationFor = (shot: Shot) =>
  shot.enter === 'bottom'
    ? slide({direction: 'from-bottom'})
    : shot.enter === 'fade'
      ? fade()
      : slide({direction: 'from-right'});

export const MuseWonder: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#F3F1EC'}}>
    <TransitionSeries>
      {shots.flatMap((shot, i) => {
        const items: React.ReactNode[] = [];
        if (i > 0) {
          items.push(
            <TransitionSeries.Transition
              key={`t${i}`}
              presentation={needsTransition(shot) ? presentationFor(shot) : fade()}
              timing={linearTiming({durationInFrames: needsTransition(shot) ? s(TRANS_S) : s(0.28)})}
            />,
          );
        }
        items.push(
          <TransitionSeries.Sequence
            key={`s${i}`}
            durationInFrames={s(shot.dur) + (i < shots.length - 1 ? s(TRANS_S) : 0)}
          >
            {/* KenBurns：页内持续缓慢推近，避免静帧感 */}
            <KenBurns to={shot.id === 'chapter' ? 1.03 : 1.055}>
              {nodeFor(shot)}
            </KenBurns>
            {shot.id !== 'chapter' ? <BrandMark tone={shot.id === 'blueprint' ? 'dark' : 'light'} /> : null}
          </TransitionSeries.Sequence>,
        );
        return items;
      })}
    </TransitionSeries>
    <Sequence from={0} durationInFrames={s(DURATION)} name="subtitle">
      <SubtitleTrack cues={cues} />
    </Sequence>
    <Sequence from={0} durationInFrames={s(DURATION)} name="audio">
      <AudioTrack cues={cues} />
    </Sequence>
  </AbsoluteFill>
);
