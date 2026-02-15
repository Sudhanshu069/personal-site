import { PROFILE } from "@/data/profile";
import { AchievementLine } from "../ui";
import type { CommandContext, CommandResult } from "./types";

export function renderHelpManpage({
  unlockDoc,
}: {
  unlockDoc: boolean;
}): CommandResult {
  return {
    output: (
      <div className="space-y-3 font-mono">
        <div>
          <div className="text-mocha-subtext">NAME</div>
          <div className="text-mocha-text">help — terminal commands & shortcuts</div>
        </div>

        <div>
          <div className="text-mocha-subtext">SYNOPSIS</div>
          <div className="text-mocha-text">
            <span className="text-mocha-yellow">help</span>{" "}
            <span className="text-mocha-overlay">|</span>{" "}
            <span className="text-mocha-yellow">about</span>{" "}
            <span className="text-mocha-overlay">|</span>{" "}
            <span className="text-mocha-yellow">experience</span>{" "}
            <span className="text-mocha-overlay">|</span>{" "}
            <span className="text-mocha-yellow">projects</span>{" "}
            <span className="text-mocha-overlay">|</span>{" "}
            <span className="text-mocha-yellow">blog</span>{" "}
            <span className="text-mocha-overlay">|</span>{" "}
            <span className="text-mocha-yellow">contact</span>{" "}
            <span className="text-mocha-overlay">|</span>{" "}
            <span className="text-mocha-yellow">resume</span>{" "}
            <span className="text-mocha-overlay">|</span>{" "}
            <span className="text-mocha-yellow">pong</span>
          </div>
        </div>

        <div>
          <div className="text-mocha-subtext">COMMANDS</div>
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 max-w-3xl">
            <div className="text-mocha-yellow">about</div>
            <div className="text-mocha-subtext">about {PROFILE.name}</div>

            <div className="text-mocha-yellow">experience</div>
            <div className="text-mocha-subtext">skills + work + impact</div>

            <div className="text-mocha-yellow">projects</div>
            <div className="text-mocha-subtext">featured builds</div>

            <div className="text-mocha-yellow">blog</div>
            <div className="text-mocha-subtext">posts</div>

            <div className="text-mocha-yellow">contact</div>
            <div className="text-mocha-subtext">email + socials</div>

            <div className="text-mocha-yellow">resume</div>
            <div className="text-mocha-subtext">open /resume.pdf</div>

            <div className="text-mocha-yellow">pong</div>
            <div className="text-mocha-subtext">tiny game</div>

            <div className="text-mocha-yellow">history</div>
            <div className="text-mocha-subtext">show previous commands</div>

            <div className="text-mocha-yellow">clear</div>
            <div className="text-mocha-subtext">wipe terminal</div>
          </div>
        </div>

        <div>
          <div className="text-mocha-subtext">TIPS</div>
          <div className="space-y-1 text-mocha-text">
            <div>
              <span className="text-mocha-subtext">Tab</span>{" "}
              <span className="text-mocha-overlay">→</span> autocomplete
            </div>
            <div>
              <span className="text-mocha-subtext">↑/↓</span>{" "}
              <span className="text-mocha-overlay">→</span> history
            </div>
            <div>
              <span className="text-mocha-subtext">Ctrl+L</span>{" "}
              <span className="text-mocha-overlay">→</span> clear
            </div>
          </div>
        </div>

        {unlockDoc ? <AchievementLine label="documentation enjoyer" /> : null}
      </div>
    ),
  };
}

export function handleHelpCommand(ctx: CommandContext): CommandResult {
  const { refs, effectiveCmd } = ctx;
  const { helpCountRef, achievementsRef } = refs;

  const chosenOne = effectiveCmd === "help" && Math.random() < 0.005;
  const shouldShowDocAchievement =
    effectiveCmd === "help" &&
    helpCountRef.current >= 3 &&
    !achievementsRef.current.documentationEnjoyer;

  if (shouldShowDocAchievement) {
    achievementsRef.current.documentationEnjoyer = true;
  }

  return {
    output: (
      <div className="space-y-4">
        {chosenOne ? (
          <div className="text-mocha-mauve font-mono">you are the chosen one.</div>
        ) : null}
        <div className="grid grid-cols-[1fr_2fr] gap-x-4 gap-y-1 max-w-2xl">
          <div>
            <span className="text-mocha-yellow">about</span>
          </div>
          <div className="text-mocha-subtext">- about {PROFILE.name}</div>

          <div>
            <span className="text-mocha-yellow">clear</span>
          </div>
          <div className="text-mocha-subtext">- clear the terminal</div>

          <div>
            <span className="text-mocha-yellow">contact</span>
          </div>
          <div className="text-mocha-subtext">- reach me (email + socials)</div>

          <div>
            <span className="text-mocha-yellow">experience</span>
          </div>
          <div className="text-mocha-subtext">- view skills + work experience</div>

          <div>
            <span className="text-mocha-yellow">help</span>
          </div>
          <div className="text-mocha-subtext">- check available commands</div>

          <div>
            <span className="text-mocha-yellow">history</span>
          </div>
          <div className="text-mocha-subtext">- view command history</div>

          <div>
            <span className="text-mocha-yellow">projects</span>
          </div>
          <div className="text-mocha-subtext">- view projects that I&apos;ve coded</div>

          <div>
            <span className="text-mocha-yellow">pong</span>
          </div>
          <div className="text-mocha-subtext">- play ping pong in the terminal</div>

          <div>
            <span className="text-mocha-yellow">resume</span>
          </div>
          <div className="text-mocha-subtext">- check out my resume</div>

          <div>
            <span className="text-mocha-yellow">blog</span>
          </div>
          <div className="text-mocha-subtext">- read my blog posts</div>
        </div>

        <div className="space-y-1 pt-2">
          <div className="grid grid-cols-[auto_1fr] gap-x-4">
            <div className="text-mocha-text font-bold w-32">Tab</div>
            <div className="text-mocha-subtext">=&gt; autocompletes the command</div>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-4">
            <div className="text-mocha-text font-bold w-32">↑</div>
            <div className="text-mocha-subtext">=&gt; go back to previous command</div>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-4">
            <div className="text-mocha-text font-bold w-32">Ctrl + L</div>
            <div className="text-mocha-subtext">=&gt; clear the terminal</div>
          </div>
        </div>

        {shouldShowDocAchievement ? (
          <AchievementLine label="documentation enjoyer" />
        ) : null}
      </div>
    ),
  };
}
