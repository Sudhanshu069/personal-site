"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { COMMANDS, IDLE_LINES } from "@/components/Terminal/shell/constants";
import { executeCommand } from "@/components/Terminal/shell/commandExecutor";
import type { HistoryItem } from "@/components/Terminal/shell/types";
import { WelcomeBlock } from "@/components/Terminal/shell/ui";
import { getGhostHint } from "@/components/Terminal/shell/utils";

function ShellWithParams() {
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
          IDLE_LINES[Math.floor(Math.random() * IDLE_LINES.length)] ??
          IDLE_LINES[0];
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

  const handleCommand = (cmd: string): { nextInput?: string } | void => {
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
    });
  };

  useEffect(() => {
    if (!runParam) return;
    if (queryRunRef.current === runParam) return;

    // Only allow safe, query-driven entry points
    if (runParam !== "about" && runParam !== "contact") return;

    queryRunRef.current = runParam;
    handleCommand(runParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runParam]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeApp) return;
    setIdleLine(null);
    const trimmed = input.trim();
    const result = trimmed ? handleCommand(input) : undefined;

    if (result && typeof result === "object" && "nextInput" in result) {
      setInput(result.nextInput ?? "");
    } else {
      setInput("");
    }

    setHistoryIndex(null);
    setTempInput("");
  };

  const ghostHint = getGhostHint(input);

  return (
    <div
      className="h-full overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-mocha-surface1"
      ref={scrollRef}
      onClick={() => {
        if (!activeApp) inputRef.current?.focus();
      }}
    >
      {/* History */}
      {history.map((item) => (
        <div key={item.id} className="space-y-2 mb-2">
          {item.command !== "welcome" && (
            <div className="flex items-center gap-2">
              <span className="text-mocha-green">➜</span>
              <span className="text-mocha-blue">~</span>
              <span className="text-mocha-text">{item.command}</span>
            </div>
          )}
          <div className="text-mocha-text animate-in fade-in slide-in-from-left-1 duration-200">
            {item.output}
          </div>
        </div>
      ))}

      {idleLine && !activeApp ? (
        <div className="mb-2 text-mocha-overlay font-mono">{idleLine}</div>
      ) : null}

      {/* Input Area */}
      {!activeApp && (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-mocha-green">➜</span>
          <span className="text-mocha-blue">~</span>
          <div className="relative flex-1 overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center font-mono"
            >
              <span className="text-mocha-text whitespace-pre">{input}</span>
              {ghostHint ? (
                <span className="text-mocha-overlay/70 whitespace-pre">{ghostHint}</span>
              ) : null}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setIdleLine(null);
                setInput(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              className="relative w-full bg-transparent outline-none border-none text-transparent caret-mocha-green font-mono placeholder-mocha-overlay"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </form>
      )}
    </div>
  );
}

export function Shell() {
  return (
    <Suspense
      fallback={
        <div className="h-full overflow-y-auto p-4 md:p-6 flex items-center justify-center">
          <div className="text-mocha-overlay">Loading terminal...</div>
        </div>
      }
    >
      <ShellWithParams />
    </Suspense>
  );
}
