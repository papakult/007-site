import type { RefObject } from 'react';

export type SceneMotion = { progress: number; reduced: boolean };

export type SceneProps = {
  motion: RefObject<SceneMotion>;
  active: boolean;
  onReady: () => void;
  onFailure: () => void;
};
