"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useSearchParams } from "next/navigation";
import { executeCommand } from "./commandExecutor";
import { COMMANDS, IDLE_LINES } from "./constants";
import type { HistoryItem } from "./types";
import { WelcomeBlock } from "./ui";
import { getGhostHint } from "./utils";

export function useShellController() {
  const searchParams = useSearchParams();
  const [input, setInput] = useState("");
  const [activeApp, setActiveApp] = useState<null | "pong">(null);
  const [idleLine, setIdleLine] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => [
    {
      id: "welcome",
      command: "welcome",
      output: <WelcomeBlock heading="Pick your route:" />,
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [tempInput, setTempInput] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pendingTimeoutsRef = useRef<Set<number>>(new Set());
  const skipAutoScrollOnceRef = useRef(true);
  const queryRunRef = useRef<string | null>(null);
  const helpCountRef = useRef(0);
  const manpageShownRef = useRef(false);
  const achievementsRef = useRef({
    procrastinator: false,
    documentationEnjoyer: false,
    speedrunner: false,
    recruiterMode: false,
  });
  const commandBurstRef = useRef<number[]>([]);
  const recruiterSeqRef = useRef<0 | 1 | 2 | 3>(0);
  const idleTimerRef = useRef<number | null>(null);
  const idleShownRef = useRef(false);

  const schedule = (callback: () => void, delayMs: number) => {
    const timeoutId = window.setTimeout(() => {
      pendingTimeoutsRef.current.delete(timeoutId);
      callback();
    }, delayMs);

    pendingTimeoutsRef.current.add(timeoutId);
    return timeoutId;
  };

  useEffect(() => {
    const pendingTimeouts = pendingTimeoutsRef.current;
    return () => {
      for (const id of pendingTimeouts) {
        window.clearTimeout(id);
      }
      pendingTimeouts.clear();
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when history changes
    if (!scrollRef.current) return;

    // Avoid forcing layout during initial paint (can trigger FOUC warnings in Lighthouse)
    if (skipAutoScrollOnceRef.current) {
      skipAutoScrollOnceRef.current = false;
      return;
    }

    requestAnimationFrame(() => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    });
  }, [history]);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const resetIdle = () => {
      // any key press counts as "activity"
      idleShownRef.current = false;
      setIdleLine(null);

      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }

      // Don't show idle easter eggs while an "app" (pong) is active.
      if (activeApp) return;

      idleTimerRef.current = window.setTimeout(() => {
        if (activeApp) return;
        if (idleShownRef.current) return;

        idleShownRef.current = true;

        const line =
          IDLE_LINES[Math.floor(Math.random() * IDLE_LINES.length)] ?? IDLE_LINES[0];
        setIdleLine(line);
      }, 20_000);
    };

    const onKeyDown = () => resetIdle();
    window.addEventListener("keydown", onKeyDown);

    // start timer on mount / when leaving pong
    resetIdle();

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    };
  }, [activeApp]);

  const runParam = searchParams.get("run")?.toLowerCase() ?? null;

  const runCommand = (cmd: string): { nextInput?: string } | void => {
    return executeCommand({
      cmd,
      history,
      setHistory,
      setInput,
      setActiveApp,
      inputRef,
      refs: {
        helpCountRef,
        manpageShownRef,
        achievementsRef,
        commandBurstRef,
        recruiterSeqRef,
      },
      schedule,
      navigateTo: (href) => {
        window.location.href = href;
      },
      openInNewTab: (href) => {
        window.open(href, "_blank", "noopener,noreferrer");
      },
    });
  };

  useEffect(() => {
    if (!runParam) return;
    if (queryRunRef.current === runParam) return;

    // Only allow safe, query-driven entry points
    if (runParam !== "about" && runParam !== "contact") return;

    queryRunRef.current = runParam;
    runCommand(runParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runParam]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;

      const newIndex =
        historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);

      if (historyIndex === null) {
        setTempInput(input);
      }

      setHistoryIndex(newIndex);
      setInput(history[newIndex].command);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;

      const newIndex = historyIndex + 1;

      if (newIndex >= history.length) {
        setHistoryIndex(null);
        setInput(tempInput);
      } else {
        setHistoryIndex(newIndex);
        setInput(history[newIndex].command);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (!input) return;

      const matches = COMMANDS.filter((cmd) => cmd.startsWith(input.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setInput("");
      setHistoryIndex(null);
      setTempInput("");
    } else if (e.key.toLowerCase() === "c" && e.ctrlKey) {
      const el = e.currentTarget;
      const hasSelection =
        el.selectionStart !== null &&
        el.selectionEnd !== null &&
        el.selectionStart !== el.selectionEnd;

      // Allow normal copy behavior if user selected text in the input
      if (hasSelection) return;

      e.preventDefault();
      setInput("");
      setHistoryIndex(null);
      setTempInput("");
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (activeApp) return;
    setIdleLine(null);
    const trimmed = input.trim();
    const result = trimmed ? runCommand(input) : undefined;

    if (result && typeof result === "object" && "nextInput" in result) {
      setInput(result.nextInput ?? "");
    } else {
      setInput("");
    }

    setHistoryIndex(null);
    setTempInput("");
  };

  const ghostHint = useMemo(() => getGhostHint(input), [input]);

  return {
    input,
    setInput,
    activeApp,
    idleLine,
    history,
    inputRef,
    scrollRef,
    handleKeyDown,
    handleSubmit,
    ghostHint,
    clearIdleLine: () => setIdleLine(null),
    focusInput: () => {
      if (!activeApp) inputRef.current?.focus();
    },
  };
}
