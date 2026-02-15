"use client";

import type {
  Dispatch,
  RefObject,
  SetStateAction,
} from "react";
import Link from "next/link";
import { PROFILE } from "@/data/profile";
import { PROJECTS } from "@/data/projects";
import { PongGame } from "@/components/Terminal/PongGame";
import { COWSAY_LINES, ROAST_LITE_LINES } from "./constants";
import { getDayOfYear, renderCowsay, suggestCommand } from "./utils";
import { AchievementLine, CopyableLink, WelcomeBlock } from "./ui";
import type { ActiveApp, CommandRefs, HistoryItem } from "./types";

type ExecuteCommandParams = {
  cmd: string;
  history: HistoryItem[];
  setHistory: Dispatch<SetStateAction<HistoryItem[]>>;
  setInput: Dispatch<SetStateAction<string>>;
  setActiveApp: Dispatch<SetStateAction<ActiveApp>>;
  inputRef: RefObject<HTMLInputElement | null>;
  refs: CommandRefs;
};

export function executeCommand({
  cmd,
  history,
  setHistory,
  setInput,
  setActiveApp,
  inputRef,
  refs,
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
  let output: React.ReactNode;
  let nextInput: string | undefined;
  let unlockedSpeedrunner = false;
  let unlockedRecruiterMode = false;
  let handled = false;

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

  if (/^sudo(\s|$)/.test(cleanCmd)) {
    handled = true;
    output = (
      <div className="space-y-1 font-mono">
        <div className="text-mocha-red">permission denied: you are not root here.</div>
        <div className="text-mocha-subtext">
          try: <span className="text-mocha-yellow">experience</span>{" "}
          <span className="text-mocha-overlay">(no privileges required)</span>
        </div>
      </div>
    );
  }

  if (!handled) {
    if (isHelp || isHelpHelp) {
      helpCountRef.current += 1;
    }

    if (isHelpHelp && !manpageShownRef.current) {
      manpageShownRef.current = true;
      const unlockDoc =
        helpCountRef.current >= 3 &&
        !achievementsRef.current.documentationEnjoyer;

      output = (
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
      );

      setHistory((prev) => [
        ...prev,
        {
          id: entryId,
          command: cmd,
          output,
        },
      ]);

      if (unlockDoc) {
        achievementsRef.current.documentationEnjoyer = true;
      }

      return;
    }

    const effectiveCmd = isHelpHelp ? "help" : cleanCmd;

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

    switch (effectiveCmd) {
      case "welcome":
        output = <WelcomeBlock heading="Try this:" />;
        break;
      case "ls":
      case "help": {
        const chosenOne = effectiveCmd === "help" && Math.random() < 0.005;
        output = (
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
              <div className="text-mocha-subtext">
                - play ping pong in the terminal
              </div>

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
                <div className="text-mocha-subtext">
                  =&gt; go back to previous command
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-x-4">
                <div className="text-mocha-text font-bold w-32">Ctrl + L</div>
                <div className="text-mocha-subtext">=&gt; clear the terminal</div>
              </div>
            </div>

            {effectiveCmd === "help" &&
            helpCountRef.current >= 3 &&
            !achievementsRef.current.documentationEnjoyer ? (
              <AchievementLine label="documentation enjoyer" />
            ) : null}
          </div>
        );

        if (
          effectiveCmd === "help" &&
          helpCountRef.current >= 3 &&
          !achievementsRef.current.documentationEnjoyer
        ) {
          achievementsRef.current.documentationEnjoyer = true;
        }
        break;
      }
      case "about":
        output = (
          <div className="space-y-2">
            <p>
              Name: <span className="text-mocha-blue">{PROFILE.name}</span>
            </p>
            <p>
              Role: <span className="text-mocha-green">{PROFILE.title}</span>
            </p>
            <p>
              Location: <span className="text-mocha-peach">{PROFILE.location}</span>
            </p>
            <p className="mt-2 text-mocha-subtext">
              Type <span className="text-mocha-yellow">resume</span> for more details.
            </p>
          </div>
        );
        break;
      case "cowsay": {
        // Hidden easter egg: not listed in help / autocomplete.
        const idx = getDayOfYear() % COWSAY_LINES.length;
        const line = COWSAY_LINES[idx] ?? COWSAY_LINES[0];
        output = (
          <pre className="text-mocha-text whitespace-pre overflow-x-auto">
            {renderCowsay(line)}
          </pre>
        );
        break;
      }
      case "experience":
      case "skills": // alias
        output = (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-mocha-subtext">Skills</p>
              <div className="flex flex-wrap gap-2">
                {PROFILE.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2 py-1 bg-mocha-surface0 text-mocha-text rounded-md font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-mocha-subtext">Experience</p>
              {PROFILE.experience.map((exp) => (
                <div
                  key={`${exp.company}-${exp.role}-${exp.period}`}
                  className="space-y-2"
                >
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
                    <div className="text-mocha-text">
                      <span className="text-mocha-blue font-bold">{exp.role}</span>{" "}
                      <span className="text-mocha-subtext">at</span>{" "}
                      <span className="text-mocha-text font-bold">{exp.company}</span>
                      {exp.location ? (
                        <span className="text-mocha-overlay"> • {exp.location}</span>
                      ) : null}
                    </div>
                    <div className="text-mocha-overlay font-mono text-sm">
                      {exp.period}
                    </div>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-mocha-subtext">
                    {exp.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
        break;
      case "projects": {
        const finalOutput = (
          <div className="space-y-4">
            <p className="text-mocha-overlay">Listing top projects...</p>
            <div className="grid grid-cols-1 gap-4">
              {PROJECTS.map((p) => (
                <div
                  key={p.id}
                  className="border border-mocha-surface0 p-3 rounded hover:border-mocha-blue transition-colors"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-mocha-blue font-bold">{p.title}</span>
                    <Link
                      href={`/projects/${p.id}`}
                      className="text-xs text-mocha-overlay underline decoration-mocha-overlay hover:text-mocha-text"
                    >
                      View Details
                    </Link>
                  </div>
                  <p className="text-mocha-subtext text-sm mb-2">{p.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-1.5 py-0.5 bg-mocha-surface0 text-mocha-text rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

        const stage = (lines: string[]) => (
          <div className="space-y-1 font-mono text-mocha-overlay">
            {lines.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
        );

        output = stage(["fetching…"]);
        window.setTimeout(() => {
          setHistory((prev) =>
            prev.map((item) =>
              item.id === entryId
                ? { ...item, output: stage(["fetching…", "rendering…"]) }
                : item
            )
          );
        }, 50);
        window.setTimeout(() => {
          setHistory((prev) =>
            prev.map((item) =>
              item.id === entryId
                ? { ...item, output: stage(["fetching…", "rendering…", "done."]) }
                : item
            )
          );
        }, 100);
        window.setTimeout(() => {
          setHistory((prev) =>
            prev.map((item) =>
              item.id === entryId
                ? {
                    ...item,
                    output: (
                      <div className="space-y-3">
                        <div className="text-mocha-green font-mono text-sm">done.</div>
                        {finalOutput}
                      </div>
                    ),
                  }
                : item
            )
          );
        }, 150);
        break;
      }
      case "blog":
      case "writing": {
        // alias
        const finalOutput = (
          <div className="space-y-2">
            <p>Redirecting to blog...</p>
            <p className="text-mocha-subtext">
              If not redirected,{" "}
              <Link href="/blog" className="text-mocha-blue underline">
                click here
              </Link>
              .
            </p>
          </div>
        );

        const stage = (lines: string[]) => (
          <div className="space-y-1 font-mono text-mocha-overlay">
            {lines.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
        );

        output = stage(["fetching…"]);
        window.setTimeout(() => {
          setHistory((prev) =>
            prev.map((item) =>
              item.id === entryId
                ? { ...item, output: stage(["fetching…", "rendering…"]) }
                : item
            )
          );
        }, 50);
        window.setTimeout(() => {
          setHistory((prev) =>
            prev.map((item) =>
              item.id === entryId
                ? { ...item, output: stage(["fetching…", "rendering…", "done."]) }
                : item
            )
          );
        }, 100);
        window.setTimeout(() => {
          setHistory((prev) =>
            prev.map((item) =>
              item.id === entryId
                ? {
                    ...item,
                    output: (
                      <div className="space-y-3">
                        <div className="text-mocha-green font-mono text-sm">done.</div>
                        {finalOutput}
                      </div>
                    ),
                  }
                : item
            )
          );
          window.location.href = "/blog";
        }, 150);
        break;
      }
      case "contact":
        output = (
          <div className="space-y-3">
            <p>
              Email:{" "}
              <a href={`mailto:${PROFILE.email}`} className="text-mocha-blue underline">
                {PROFILE.email}
              </a>
            </p>
            <div className="space-y-2">
              {PROFILE.socials.map((s) => (
                <CopyableLink
                  key={s.name}
                  label={s.name}
                  value={s.url}
                  openInNewTab={s.name === "LeetCode"}
                  suffix={s.name === "LeetCode" ? "(DSA museum)" : undefined}
                />
              ))}
            </div>
          </div>
        );
        break;
      case "email":
      case "socials":
        output = (
          <div className="text-mocha-subtext">
            Use <span className="text-mocha-yellow">contact</span>.
          </div>
        );
        break;
      case "resume":
        output = (
          <div className="space-y-2">
            <p>Opening resume in a new tab...</p>
            <p className="text-mocha-subtext">
              If it didn&apos;t open,{" "}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-mocha-blue underline"
              >
                click here
              </a>
              .
            </p>
          </div>
        );
        // Open in new tab (keep current terminal session)
        window.open("/resume.pdf", "_blank", "noopener,noreferrer");
        break;
      case "pong":
        setActiveApp("pong");
        output = (
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
                          output: (
                            <div className="text-mocha-subtext font-mono">
                              exited pong
                            </div>
                          ),
                        }
                      : item
                  )
                );
                setTimeout(() => inputRef.current?.focus(), 0);
              }}
            />
          </div>
        );

        if (!achievementsRef.current.procrastinator) {
          achievementsRef.current.procrastinator = true;
        }
        break;
      case "history":
        output = (
          <div className="space-y-1">
            {history.map((item, i) => (
              <div key={item.id} className="text-mocha-text">
                <span className="text-mocha-subtext mr-4">{i + 1}</span>
                {item.command}
              </div>
            ))}
          </div>
        );
        break;
      case "whoami":
        output = <div className="text-mocha-text">visitor</div>;
        break;
      case "pwd":
        output = <div className="text-mocha-text">/home/visitor</div>;
        break;
      case "q":
      case "clear":
        setHistory([]);
        return;
      case "":
        output = null;
        break;
      default: {
        const suggestion = suggestCommand(cleanCmd);
        if (suggestion) {
          nextInput = suggestion;
          output = (
            <div className="text-mocha-subtext">
              Did you mean: <span className="text-mocha-yellow">{suggestion}</span> ?{" "}
              <span className="text-mocha-overlay">(press Enter)</span>
            </div>
          );
          break;
        }

        output = (
          <div className="text-mocha-red">
            <div>
              Unknown command: <span className="text-mocha-text">{cleanCmd}</span>
            </div>
            <div className="text-mocha-subtext mt-1">
              Try:{" "}
              <span
                className="text-mocha-yellow cursor-pointer"
                onClick={() => setInput("help")}
              >
                help
              </span>
            </div>
            <div className="text-mocha-overlay mt-1">
              {ROAST_LITE_LINES[Math.floor(Math.random() * ROAST_LITE_LINES.length)]}
            </div>
          </div>
        );
      }
    }
  }

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

  setHistory((prev) => [
    ...prev,
    {
      id: entryId,
      command: cmd,
      output,
    },
  ]);

  if (nextInput !== undefined) {
    return { nextInput };
  }
}
