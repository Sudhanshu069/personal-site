import type { MutableRefObject, ReactNode } from "react";

export interface HistoryItem {
  id: string;
  command: string;
  output: ReactNode;
}

export type ActiveApp = null | "pong";

export interface AchievementsState {
  procrastinator: boolean;
  documentationEnjoyer: boolean;
  speedrunner: boolean;
  recruiterMode: boolean;
}

export interface CommandRefs {
  helpCountRef: MutableRefObject<number>;
  manpageShownRef: MutableRefObject<boolean>;
  achievementsRef: MutableRefObject<AchievementsState>;
  commandBurstRef: MutableRefObject<number[]>;
  recruiterSeqRef: MutableRefObject<0 | 1 | 2 | 3>;
}
