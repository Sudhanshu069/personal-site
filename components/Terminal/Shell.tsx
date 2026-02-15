"use client";

import React, { Suspense } from "react";
import { useShellController } from "@/components/Terminal/shell/useShellController";

function ShellWithParams() {
  const {
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
    clearIdleLine,
    focusInput,
  } = useShellController();

  return (
    <div
      className="h-full overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-mocha-surface1"
      ref={scrollRef}
      onClick={focusInput}
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
                clearIdleLine();
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
