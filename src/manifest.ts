import raw from './manifest.json';

export type SceneTiming = {
  id: string;
  seconds: number;
  frames: number;
};

export type Manifest = {
  fps: number;
  totalFrames: number;
  scenes: SceneTiming[];
};

export const manifest = raw as Manifest;

export const sceneOffsets = (): {id: string; from: number; frames: number}[] => {
  let cursor = 0;
  return manifest.scenes.map((scene) => {
    const entry = {id: scene.id, from: cursor, frames: scene.frames};
    cursor += scene.frames;
    return entry;
  });
};
