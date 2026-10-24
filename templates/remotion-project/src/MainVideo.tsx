import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {content, cues} from './data/topic';
import {SubtitleTrack} from './components/SubtitleTrack';
import {
  BlueprintScene,
  CardRow,
  CompareScene,
  FourGrid,
  LimitScene,
  SourceScene,
  SplitScene,
  StatScene,
  StoryScene,
  TitleCard,
} from './components/scenes';
import {FPS} from './theme';

const s = (sec: number) => Math.round(sec * FPS);

/** 镜头表：起止时间（秒）。总时长 = 最后一镜的 from + dur */
const SHOTS: {from: number; dur: number; node: React.ReactNode}[] = [
  {from: 0, dur: 5, node: <TitleCard {...content.title} />},
  {from: 5, dur: 5, node: <FourGrid items={content.fourGrid} />},
  {from: 10, dur: 23, node: <StoryScene {...content.story} />},
  {from: 33, dur: 12, node: <StatScene {...content.statA} />},
  {from: 45, dur: 15, node: <StatScene {...content.statB} />},
  {from: 60, dur: 15, node: <CompareScene {...content.compareA} />},
  {from: 75, dur: 12, node: <CompareScene {...content.compareB} />},
  {from: 87, dur: 18, node: <SplitScene kicker={content.split.kicker} left={content.split.left} right={content.split.right} />},
  {from: 105, dur: 15, node: <CardRow {...content.cardsA} />},
  {from: 120, dur: 20, node: <CardRow {...content.cardsB} />},
  {from: 140, dur: 45, node: <BlueprintScene {...content.blueprint} />},
  {from: 185, dur: 23, node: <LimitScene {...content.limits} />},
  {from: 208, dur: 7, node: <SourceScene {...content.source} />},
];

export const TOTAL_SECONDS = 215;

export const MainVideo: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#F3F1EC'}}>
    {SHOTS.map((shot, i) => (
      <Sequence key={i} from={s(shot.from)} durationInFrames={s(shot.dur)} name={`shot-${i + 1}`}>
        {shot.node}
      </Sequence>
    ))}
    <Sequence from={0} durationInFrames={s(TOTAL_SECONDS)} name="subtitle">
      <SubtitleTrack cues={cues} />
    </Sequence>
  </AbsoluteFill>
);
