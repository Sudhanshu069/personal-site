"use client";

import React, { useState } from "react";
import { Copy, Check, Mail, Github, Twitter, Linkedin } from "lucide-react";
import { PROFILE } from "@/data/profile";

export default function ContactPage() {
    const [copied, setCopied] = useState(false);

    const copyEmail = () => {
        navigator.clipboard.writeText(PROFILE.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-mocha-surface1 items-center justify-center">
            <div className="max-w-2xl w-full bg-mocha-mantle/50 border border-mocha-surface0 rounded-xl p-8 shadow-xl">
                <h1 className="text-3xl font-bold text-center text-mocha-mauve mb-2">Get in Touch</h1>
                <p className="text-center text-mocha-subtext mb-8">
                    Have a project in mind or just want to say hi? I'm always open to discussing new opportunities.
                </p>

                <div className="flex flex-col gap-6 items-center">
                    {/* Email Card */}
                    <div className="w-full bg-mocha-surface0/30 p-4 rounded-lg flex items-center justify-between group hover:bg-mocha-surface0/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-mocha-blue/10 rounded-full text-mocha-blue">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-mocha-subtext">Email</p>
                                <p className="text-mocha-text font-mono text-sm md:text-base">{PROFILE.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={copyEmail}
                            className="p-2 hover:bg-mocha-surface1 rounded transition-colors text-mocha-overlay hover:text-mocha-text"
                            title="Copy email"
                        >
                            {copied ? <Check className="w-4 h-4 text-mocha-green" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-4 mt-2">
                        {PROFILE.socials.map(s => {
                            const Icon = s.name === "GitHub" ? Github : s.name === "Twitter" ? Twitter : Linkedin;
                            return (
                                <a
                                    key={s.name}
                                    href={s.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-mocha-surface0/30 rounded-full text-mocha-subtext hover:bg-mocha-surface0/50 hover:text-mocha-mauve transition-all hover:scale-110"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            );
                        })}
                    </div>

                    <div className="mt-8 text-center w-full">
                        <a
                            href={`mailto:${PROFILE.email}`}
                            className="block w-full py-3 bg-mocha-blue text-mocha-base font-bold rounded-lg hover:bg-mocha-sapphire transition-colors transform active:scale-95"
                        >
                            Send a Message
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
