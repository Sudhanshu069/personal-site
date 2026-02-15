import { PongGame } from "@/components/Terminal/PongGame";
import { COWSAY_LINES, ROAST_LITE_LINES } from "../constants";
import { renderCowsay, suggestCommand, getDayOfYear } from "../utils";
import { AchievementLine, WelcomeBlock } from "../ui";
import type { CommandContext, CommandResult } from "./types";

export function handleWelcomeCommand(): CommandResult {
  return { output: <WelcomeBlock heading="Try this:" /> };
}

export function handleSudoCommand(): CommandResult {
  return {
    output: (
      <div className="space-y-1 font-mono">
        <div className="text-mocha-red">permission denied: you are not root here.</div>
        <div className="text-mocha-subtext">
          try: <span className="text-mocha-yellow">experience</span>{" "}
          <span className="text-mocha-overlay">(no privileges required)</span>
        </div>
      </div>
    ),
  };
}

export function handleCowsayCommand(): CommandResult {
  const idx = getDayOfYear() % COWSAY_LINES.length;
  const line = COWSAY_LINES[idx] ?? COWSAY_LINES[0];

  return {
    output: (
      <pre className="text-mocha-text whitespace-pre overflow-x-auto">
        {renderCowsay(line)}
      </pre>
    ),
  };
}

export function handlePongCommand(ctx: CommandContext): CommandResult {
  const { refs, entryId, setActiveApp, setHistory, inputRef, schedule } = ctx;
  const { achievementsRef } = refs;

  setActiveApp("pong");

  const output = (
    <div className="space-y-2">
      {!achievementsRef.current.procrastinator ? (
        <AchievementLine label="procrastinator" />
      ) : null}
      <PongGame
        onExit={() => {
          setActiveApp(null);
          setHistory((prev) =>
            prev.map((item) =>
              item.id === entryId
                ? {
                    ...item,
                    output: <div className="text-mocha-subtext font-mono">exited pong</div>,
                  }
                : item
            )
          );
          schedule(() => inputRef.current?.focus(), 0);
        }}
      />
    </div>
  );

  if (!achievementsRef.current.procrastinator) {
    achievementsRef.current.procrastinator = true;
  }

  return { output };
}

export function handleHistoryCommand(ctx: CommandContext): CommandResult {
  const { history } = ctx;
  return {
    output: (
      <div className="space-y-1">
        {history.map((item, i) => (
          <div key={item.id} className="text-mocha-text">
            <span className="text-mocha-subtext mr-4">{i + 1}</span>
            {item.command}
          </div>
        ))}
      </div>
    ),
  };
}

export function handleWhoamiCommand(): CommandResult {
  return { output: <div className="text-mocha-text">visitor</div> };
}

export function handlePwdCommand(): CommandResult {
  return { output: <div className="text-mocha-text">/home/visitor</div> };
}

export function handleClearCommand(ctx: CommandContext): CommandResult {
  ctx.setHistory([]);
  return { output: null, skipAppend: true };
}

export function handleEmptyCommand(): CommandResult {
  return { output: null };
}

export function handleUnknownCommand(ctx: CommandContext): CommandResult {
  const suggestion = suggestCommand(ctx.cleanCmd);
  if (suggestion) {
    return {
      output: (
        <div className="text-mocha-subtext">
          Did you mean: <span className="text-mocha-yellow">{suggestion}</span> ?{" "}
          <span className="text-mocha-overlay">(press Enter)</span>
        </div>
      ),
      nextInput: suggestion,
    };
  }

  return {
    output: (
      <div className="text-mocha-red">
        <div>
          Unknown command: <span className="text-mocha-text">{ctx.cleanCmd}</span>
        </div>
        <div className="text-mocha-subtext mt-1">
          Try:{" "}
          <span className="text-mocha-yellow cursor-pointer" onClick={() => ctx.setInput("help")}>
            help
          </span>
        </div>
        <div className="text-mocha-overlay mt-1">
          {ROAST_LITE_LINES[Math.floor(Math.random() * ROAST_LITE_LINES.length)]}
        </div>
      </div>
    ),
  };
}
