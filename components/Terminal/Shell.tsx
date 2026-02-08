"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { PROFILE } from "@/data/profile";
import { PROJECTS } from "@/data/projects";
import Link from "next/link";
import { PongGame } from "@/components/Terminal/PongGame";
import { useSearchParams } from "next/navigation";

const ASCII_ART = `
   _____           _ _
  / ____|         | | |
 | (___  _   _  __| | |__   __ _ _ __  ___| |__  _   _
  \\___ \\| | | |/ _\` | '_ \\ / _\` | '_ \\/ __| '_ \\| | | |
  ____) | |_| | (_| | | | | (_| | | | \\__ \\ | | | |_| |
 |_____/ \\__,_|\\__,_|_| |_|\\__,_|_| |_|___/_| |_|\\__,_|
`;

interface HistoryItem {
    id: string;
    command: string;
    output: React.ReactNode;
}

const COMMANDS = ["help", "about", "experience", "projects", "blog", "contact", "resume", "pong", "clear", "welcome", "history", "pwd"];

const STATUS_LINES = [
    "Status: prod-safe (probably)",
    "Mood: shipping",
    "Latency: sub-500ms on good days",
    "Uptime: 99.9% (in my dreams)",
    "Warning: may contain semicolons",
    "Tip: type 'pong' if you came here to procrastinate",
] as const;

const COMMAND_HINTS: Record<string, string> = {
    experience: "skills + work + impact",
    projects: "featured builds",
    resume: "full PDF",
    contact: "email + socials",
    blog: "posts",
};

function getGhostHint(rawInput: string) {
    const input = rawInput.trim().toLowerCase();
    if (!input) return null;
    if (input.includes(" ")) return null;

    const candidates = Object.keys(COMMAND_HINTS);
    const matches = candidates.filter((c) => c.startsWith(input));
    if (matches.length !== 1) return null;

    const cmd = matches[0];
    if (cmd === input) return null;

    const suffix = cmd.slice(input.length);
    return `${suffix}  → ${COMMAND_HINTS[cmd]}`;
}

function WelcomeBlock({ heading }: { heading: string }) {
    const [statusLine, setStatusLine] = useState<string>("");

    useEffect(() => {
        const t = window.setTimeout(() => {
            const idx = Math.floor(Math.random() * STATUS_LINES.length);
            setStatusLine(STATUS_LINES[idx] ?? "");
        }, 0);
        return () => window.clearTimeout(t);
    }, []);

    return (
        <div className="space-y-2 mb-4">
            <pre className="text-mocha-mauve font-bold text-xs md:text-sm leading-none mb-4 whitespace-pre overflow-x-auto">
                {ASCII_ART}
            </pre>
            <p>{PROFILE.name} — {PROFILE.title}</p>
            {statusLine ? <p className="text-mocha-overlay">{statusLine}</p> : null}
            <div className="pt-2 space-y-1">
                <p className="text-mocha-subtext">{heading}</p>
                <div className="pl-2 font-mono space-y-1">
                    <div>
                        <span className="text-mocha-subtext">1)</span>{" "}
                        <span className="text-mocha-yellow">experience</span>{" "}
                        <span className="text-mocha-subtext">→ skills + work + impact</span>
                    </div>
                    <div>
                        <span className="text-mocha-subtext">2)</span>{" "}
                        <span className="text-mocha-yellow">projects</span>{" "}
                        <span className="text-mocha-subtext">→ featured builds</span>
                    </div>
                    <div>
                        <span className="text-mocha-subtext">3)</span>{" "}
                        <span className="text-mocha-yellow">resume</span>{" "}
                        <span className="text-mocha-subtext">→ full PDF</span>
                    </div>
                    <div>
                        <span className="text-mocha-subtext">4)</span>{" "}
                        <span className="text-mocha-yellow">contact</span>{" "}
                        <span className="text-mocha-subtext">→ email + socials</span>
                    </div>
                </div>
            </div>
            <p>
                For a list of available commands, type &apos;
                <span className="text-mocha-green">help</span>&apos;.
            </p>
            <p className="text-mocha-subtext">
                Pro tip: Tab to autocomplete, ↑ for history, Ctrl+L to wipe terminal
            </p>
        </div>
    );
}

function ShellWithParams() {
    const searchParams = useSearchParams();
    const [input, setInput] = useState("");
    const [activeApp, setActiveApp] = useState<null | "pong">(null);
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

    const runParam = searchParams.get("run")?.toLowerCase() ?? null;

    const handleCommand = (cmd: string) => {
        const cleanCmd = cmd.trim().toLowerCase();
        const entryId =
            typeof crypto !== "undefined" && "randomUUID" in crypto
                ? crypto.randomUUID()
                : Math.random().toString(36).slice(2);
        let output: React.ReactNode;

        switch (cleanCmd) {
            case "welcome":
                output = <WelcomeBlock heading="Try this:" />;
                break;
            case "ls":
            case "help":
                output = (
                    <div className="space-y-4">
                        <div className="grid grid-cols-[1fr_2fr] gap-x-4 gap-y-1 max-w-2xl">
                            <div><span className="text-mocha-yellow">about</span></div>
                            <div className="text-mocha-subtext">- about {PROFILE.name}</div>

                            <div><span className="text-mocha-yellow">clear</span></div>
                            <div className="text-mocha-subtext">- clear the terminal</div>

                            <div><span className="text-mocha-yellow">contact</span></div>
                            <div className="text-mocha-subtext">- reach me (email + socials)</div>

                            <div><span className="text-mocha-yellow">experience</span></div>
                            <div className="text-mocha-subtext">- view skills + work experience</div>

                            <div><span className="text-mocha-yellow">help</span></div>
                            <div className="text-mocha-subtext">- check available commands</div>

                            <div><span className="text-mocha-yellow">history</span></div>
                            <div className="text-mocha-subtext">- view command history</div>

                            <div><span className="text-mocha-yellow">projects</span></div>
                            <div className="text-mocha-subtext">- view projects that I&apos;ve coded</div>

                            <div><span className="text-mocha-yellow">pong</span></div>
                            <div className="text-mocha-subtext">- play ping pong in the terminal</div>

                            <div><span className="text-mocha-yellow">resume</span></div>
                            <div className="text-mocha-subtext">- check out my resume</div>

                            <div><span className="text-mocha-yellow">blog</span></div>
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
                    </div>
                );
                break;
            case "about":
                output = (
                    <div className="space-y-2">
                        <p>Name: <span className="text-mocha-blue">{PROFILE.name}</span></p>
                        <p>Role: <span className="text-mocha-green">{PROFILE.title}</span></p>
                        <p>Location: <span className="text-mocha-peach">{PROFILE.location}</span></p>
                        <p className="mt-2 text-mocha-subtext">Type <span className="text-mocha-yellow">resume</span> for more details.</p>
                    </div>
                );
                break;
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
                                <div key={`${exp.company}-${exp.role}-${exp.period}`} className="space-y-2">
                                    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
                                        <div className="text-mocha-text">
                                            <span className="text-mocha-blue font-bold">{exp.role}</span>{" "}
                                            <span className="text-mocha-subtext">at</span>{" "}
                                            <span className="text-mocha-text font-bold">{exp.company}</span>
                                            {exp.location ? (
                                                <span className="text-mocha-overlay"> • {exp.location}</span>
                                            ) : null}
                                        </div>
                                        <div className="text-mocha-overlay font-mono text-sm">{exp.period}</div>
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
            case "projects":
                output = (
                    <div className="space-y-4">
                        <p className="text-mocha-overlay">Listing top projects...</p>
                        <div className="grid grid-cols-1 gap-4">
                            {PROJECTS.map((p) => (
                                <div key={p.id} className="border border-mocha-surface0 p-3 rounded hover:border-mocha-blue transition-colors">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-mocha-blue font-bold">{p.title}</span>
                                        <Link href={`/projects/${p.id}`} className="text-xs text-mocha-overlay underline decoration-mocha-overlay hover:text-mocha-text">
                                            View Details
                                        </Link>
                                    </div>
                                    <p className="text-mocha-subtext text-sm mb-2">{p.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {p.tech.map((t) => (
                                            <span key={t} className="text-xs px-1.5 py-0.5 bg-mocha-surface0 text-mocha-text rounded">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
                break;
            case "blog":
            case "writing": // alias
                output = (
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
                // Client-side navigation helper
                setTimeout(() => {
                    window.location.href = "/blog";
                }, 150);
                break;
            case "contact":
                output = (
                    <div className="space-y-3">
                        <p>
                            Email:{" "}
                            <a href={`mailto:${PROFILE.email}`} className="text-mocha-blue underline">
                                {PROFILE.email}
                            </a>
                        </p>
                        <div className="flex flex-wrap gap-4">
                            {PROFILE.socials.map(s => (
                                <a
                                    key={s.name}
                                    href={s.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-mocha-mauve hover:text-mocha-pink"
                                >
                                    {s.name}
                                </a>
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
                        <p>Redirecting to resume...</p>
                        <p className="text-mocha-subtext">
                            If not redirected,{" "}
                            <a href="/resume.pdf" className="text-mocha-blue underline">
                                click here
                            </a>
                            .
                        </p>
                    </div>
                );
                // Client-side navigation helper
                setTimeout(() => {
                    window.location.href = "/resume.pdf";
                }, 150);
                break;
            case "pong":
                setActiveApp("pong");
                output = (
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
                );
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
            default:
                output = (
                    <div className="text-mocha-red">
                        Command not found: {cleanCmd}. Type <span className="text-mocha-yellow cursor-pointer" onClick={() => setInput("help")}>help</span> for a list of commands.
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

            const newIndex = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);

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

            const matches = COMMANDS.filter(cmd => cmd.startsWith(input.toLowerCase()));
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
        if (input.trim()) {
            handleCommand(input);
        }
        setInput("");
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
                                <span className="text-mocha-overlay/70 whitespace-pre">
                                    {ghostHint}
                                </span>
                            ) : null}
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
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
        <Suspense fallback={
            <div className="h-full overflow-y-auto p-4 md:p-6 flex items-center justify-center">
                <div className="text-mocha-overlay">Loading terminal...</div>
            </div>
        }>
            <ShellWithParams />
        </Suspense>
    );
}
