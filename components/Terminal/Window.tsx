"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TerminalWindowProps {
    children: ReactNode;
    className?: string;
    title?: string;
}

export function TerminalWindow({
    children,
    className,
    title = "sudhanshu@dev:~",
}: TerminalWindowProps) {
    return (
        <div
            className={cn(
                "w-full max-w-5xl mx-auto h-[85vh] md:h-[90vh] flex flex-col rounded-xl overflow-hidden shadow-2xl border border-mocha-surface0 bg-mocha-base font-mono",
                className
            )}
        >
            {/* Title Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-mocha-mantle border-b border-mocha-surface0">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-mocha-red hover:bg-red-400 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-mocha-yellow hover:bg-yellow-400 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-mocha-green hover:bg-green-400 transition-colors" />
                </div>

                <div className="text-mocha-subtext text-xs md:text-sm font-medium select-none">
                    {title}
                </div>

                <div className="w-14" /> {/* Spacer for centering */}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-mocha-surface1 scrollbar-track-transparent">
                {children}
            </div>
        </div>
    );
}
