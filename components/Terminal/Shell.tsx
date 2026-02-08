"use client";

import React, { useState, useRef, useEffect } from "react";
import { PROFILE } from "@/data/profile";
import { PROJECTS } from "@/data/projects";
import Link from "next/link";
import { Check, Copy, Terminal } from "lucide-react";

interface HistoryItem {
    id: string;
    command: string;
    output: React.ReactNode;
}

export function Shell() {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Auto-scroll to bottom when history changes
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    useEffect(() => {
        // Focus input on mount
        inputRef.current?.focus();
    }, []);

    const handleCommand = (cmd: string) => {
        const cleanCmd = cmd.trim().toLowerCase();
        let output: React.ReactNode;

        switch (cleanCmd) {
            case "help":
                output = (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-mocha-text">
                        <div><span className="text-mocha-yellow">about</span> - Who am I?</div>
                        <div><span className="text-mocha-yellow">projects</span> - View my work</div>
                        <div><span className="text-mocha-yellow">writing</span> - Read my blog</div>
                        <div><span className="text-mocha-yellow">contact</span> - Get in touch</div>
                        <div><span className="text-mocha-yellow">clear</span> - Clear terminal</div>
                    </div>
                );
                break;
            case "about":
                output = (
                    <div className="space-y-2">
                        <p>Name: <span className="text-mocha-blue">{PROFILE.name}</span></p>
                        <p>Role: <span className="text-mocha-green">{PROFILE.tagline}</span></p>
                        <p>Location: <span className="text-mocha-peach">{PROFILE.location}</span></p>
                        <p className="mt-2 text-mocha-subtext">Type <span className="text-mocha-yellow">resume</span> for more details.</p>
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
                                        <Link href={p.link} className="text-xs text-mocha-overlay underline decoration-mocha-overlay hover:text-mocha-text">
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
            case "contact":
                output = (
                    <div className="space-y-2">
                        <p>Email: <a href={`mailto:${PROFILE.email}`} className="text-mocha-blue underline">{PROFILE.email}</a></p>
                        <div className="flex gap-4">
                            {PROFILE.socials.map(s => (
                                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="text-mocha-mauve hover:text-mocha-pink">
                                    {s.name}
                                </a>
                            ))}
                        </div>
                    </div>
                );
                break;
            case "resume":
                output = (
                    <div className="space-y-2">
                        <p>Redirecting to resume...</p>
                        <script dangerouslySetInnerHTML={{ __html: `window.location.href = '/resume'` }} />
                        <p className="text-mocha-subtext">If not redirected, <Link href="/resume" className="text-mocha-blue underline">click here</Link>.</p>
                    </div>
                );
                // Client-side navigation helper
                setTimeout(() => {
                    window.location.href = "/resume";
                }, 1000);
                break;
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
                id: Math.random().toString(36).substr(2, 9),
                command: cmd,
                output,
            },
        ]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            handleCommand(input);
        }
        setInput("");
    };

    return (
        <div
            className="h-full flex flex-col p-2"
            onClick={() => inputRef.current?.focus()}
        >
            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4">
                {/* Initial Greeting */}
                <div className="space-y-2 mb-8">
                    <p className="text-mocha-subtext">Last login: {new Date().toLocaleString()} on ttys001</p>
                    <h1 className="text-mocha-mauve text-2xl font-bold">Welcome to {PROFILE.name}'s Terminal</h1>
                    <p>Type <span className="text-mocha-yellow font-bold">help</span> to see available commands.</p>
                </div>

                {/* History */}
                {history.map((item) => (
                    <div key={item.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-mocha-green">➜</span>
                            <span className="text-mocha-blue">~</span>
                            <span className="text-mocha-text">{item.command}</span>
                        </div>
                        <div className="pl-6 text-mocha-subtext animate-in fade-in slide-in-from-left-1 duration-200">
                            {item.output}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 pb-2">
                <span className="text-mocha-green">➜</span>
                <span className="text-mocha-blue">~</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent outline-none border-none text-mocha-text placeholder-mocha-overlay"
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                />
            </form>
        </div>
    );
}
