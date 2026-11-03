import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {SCENES} from './scenes';
import {manifest, sceneOffsets} from './manifest';
import {palette} from './theme';

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const offsets = sceneOffsets();
  const progress = Math.min(1, Math.max(0, frame / Math.max(1, manifest.totalFrames)));

  return (
    <AbsoluteFill style={{backgroundColor: palette.paper}}>
      {offsets.map((entry) => {
        const Scene = SCENES[entry.id];
        if (!Scene) {
          return null;
        }
        return (
          <Sequence key={entry.id} from={entry.from} durationInFrames={entry.frames} name={entry.id}>
            <Scene dur={entry.frames} />
            <Audio src={staticFile(`audio/${entry.id}.wav`)} />
          </Sequence>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: 10,
          width: `${progress * 100}%`,
          backgroundColor: palette.indigo,
          opacity: 0.9,
        }}
      />
    </AbsoluteFill>
  );
};
