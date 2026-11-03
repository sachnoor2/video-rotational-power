import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {manifest} from './manifest';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Video"
      component={Video}
      durationInFrames={manifest.totalFrames}
      fps={manifest.fps}
      width={1920}
      height={1080}
    />
  );
};
