import React from 'react';
import {Composition} from 'remotion';
import {MuseWonder} from './MuseWonder';
import {DURATION} from './data/timeline';
import {FPS, HEIGHT, WIDTH} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="MuseWonder"
    component={MuseWonder}
    durationInFrames={Math.round(DURATION * FPS)}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
