"use client";

import type { Dispatch, SetStateAction, RefObject } from "react";
import { executeRegisteredCommand } from "./commands";
import { renderHelpManpage } from "./commands/help";
import { handleSudoCommand } from "./commands/system";
import type { CommandResult } from "./commands/types";
import { AchievementLine } from "./ui";
import type { ActiveApp, CommandRefs, HistoryItem } from "./types";

type ExecuteCommandParams = {
  cmd: string;
  history: HistoryItem[];
  setHistory: Dispatch<SetStateAction<HistoryItem[]>>;
  setInput: Dispatch<SetStateAction<string>>;
  setActiveApp: Dispatch<SetStateAction<ActiveApp>>;
  inputRef: RefObject<HTMLInputElement | null>;
  refs: CommandRefs;
  schedule: (callback: () => void, delayMs: number) => number;
  navigateTo: (href: string) => void;
  openInNewTab: (href: string) => void;
};

export function executeCommand({
  cmd,
  history,
  setHistory,
  setInput,
  setActiveApp,
  inputRef,
  refs,
  schedule,
  navigateTo,
  openInNewTab,
}: ExecuteCommandParams): { nextInput?: string } | void {
  const {
    helpCountRef,
    manpageShownRef,
    achievementsRef,
    commandBurstRef,
    recruiterSeqRef,
  } = refs;

  const cleanCmd = cmd.trim().toLowerCase();
  const isHelp = cleanCmd === "help";
  const isHelpHelp = /^help\s+help$/.test(cleanCmd);
  const entryId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  let unlockedSpeedrunner = false;
  let unlockedRecruiterMode = false;

  // Achievement: speedrunner (4 commands within 10s)
  // Only count commands that actually print an entry (exclude clear/q which wipe history).
  if (cleanCmd && cleanCmd !== "clear" && cleanCmd !== "q") {
    const now = Date.now();
    const windowMs = 10_000;
    const next = commandBurstRef.current.filter((t) => now - t <= windowMs);
    next.push(now);
    commandBurstRef.current = next;

    if (next.length >= 4 && !achievementsRef.current.speedrunner) {
      achievementsRef.current.speedrunner = true;
      unlockedSpeedrunner = true;
    }
  }

  let result: CommandResult;
  const isSudo = /^sudo(\s|$)/.test(cleanCmd);

  if (isHelp || isHelpHelp) {
    helpCountRef.current += 1;
  }

  if (isHelpHelp && !manpageShownRef.current) {
    manpageShownRef.current = true;
    const unlockDoc =
      helpCountRef.current >= 3 && !achievementsRef.current.documentationEnjoyer;

    const manpage = renderHelpManpage({ unlockDoc });

    setHistory((prev) => [
      ...prev,
      {
        id: entryId,
        command: cmd,
        output: manpage.output,
      },
    ]);

    if (unlockDoc) {
      achievementsRef.current.documentationEnjoyer = true;
    }

    return;
  }

  const effectiveCmd = isHelpHelp ? "help" : cleanCmd;

  if (!isSudo) {
    // Achievement: recruiter mode (experience → projects → resume)
    // Also allow the "skills" alias to count as experience.
    if (!achievementsRef.current.recruiterMode) {
      const seqCmd = effectiveCmd === "skills" ? "experience" : effectiveCmd;
      const expected = ["experience", "projects", "resume"];
      const seqIdx = recruiterSeqRef.current;

      if (seqCmd === "clear" || seqCmd === "q") {
        recruiterSeqRef.current = 0;
      } else {
        if (seqIdx < expected.length) {
          const expectedCmd = expected[seqIdx];
          if (seqCmd === expectedCmd) {
            recruiterSeqRef.current = (seqIdx + 1) as 1 | 2 | 3;
            if (recruiterSeqRef.current === 3) {
              achievementsRef.current.recruiterMode = true;
              unlockedRecruiterMode = true;
            }
          } else if (seqCmd === "experience") {
            recruiterSeqRef.current = 1;
          } else {
            recruiterSeqRef.current = 0;
          }
        } else if (seqCmd === "experience") {
          recruiterSeqRef.current = 1;
        } else {
          recruiterSeqRef.current = 0;
        }
      }
    }

    result = executeRegisteredCommand({
      cmd,
      cleanCmd,
      effectiveCmd,
      entryId,
      history,
      setHistory,
      setInput,
      setActiveApp,
      inputRef,
      refs,
      schedule,
      navigateTo,
      openInNewTab,
    });
  } else {
    result = handleSudoCommand();
  }

  let output = result.output;

  const unlockedLabels: string[] = [];
  if (unlockedRecruiterMode) unlockedLabels.push("recruiter mode");
  if (unlockedSpeedrunner) unlockedLabels.push("speedrunner");

  if (unlockedLabels.length && output) {
    output = (
      <div className="space-y-2">
        {unlockedLabels.map((label) => (
          <AchievementLine key={label} label={label} />
        ))}
        {output}
      </div>
    );
  }

  if (!result.skipAppend) {
    setHistory((prev) => [
      ...prev,
      {
        id: entryId,
        command: cmd,
        output,
      },
    ]);
  }

  if (result.nextInput !== undefined) {
    return { nextInput: result.nextInput };
  }
}
