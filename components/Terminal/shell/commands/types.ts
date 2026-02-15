import type {
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
} from "react";
import type { ActiveApp, CommandRefs, HistoryItem } from "../types";

export interface CommandContext {
  cmd: string;
  cleanCmd: string;
  effectiveCmd: string;
  entryId: string;
  history: HistoryItem[];
  setHistory: Dispatch<SetStateAction<HistoryItem[]>>;
  setInput: Dispatch<SetStateAction<string>>;
  setActiveApp: Dispatch<SetStateAction<ActiveApp>>;
  inputRef: RefObject<HTMLInputElement | null>;
  refs: CommandRefs;
  schedule: (callback: () => void, delayMs: number) => number;
  navigateTo: (href: string) => void;
  openInNewTab: (href: string) => void;
}

export interface CommandResult {
  output: ReactNode | null;
  nextInput?: string;
  skipAppend?: boolean;
}

export type CommandHandler = (ctx: CommandContext) => CommandResult;
