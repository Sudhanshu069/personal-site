"use client";

import React, { useState } from "react";
import { PROJECTS } from "@/data/projects";
import Link from "next/link";
import { Search } from "lucide-react";

export default function ProjectsPage() {
    const [filter, setFilter] = useState("");

    const filteredProjects = PROJECTS.filter((p) => {
        const term = filter.toLowerCase();
        return (
            p.title.toLowerCase().includes(term) ||
            p.description.toLowerCase().includes(term) ||
            p.tech.some((t) => t.toLowerCase().includes(term))
        );
    });

    return (
        <div className="h-full flex flex-col p-4 md:p-8 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-mocha-mauve mb-2">Projects</h1>
                    <p className="text-mocha-subtext">A collection of my work and experiments.</p>
                </div>

                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full bg-mocha-mantle border border-mocha-surface0 rounded px-4 py-2 pl-10 text-mocha-text focus:border-mocha-blue outline-none"
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-mocha-overlay" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-mocha-surface1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                    {filteredProjects.map((p) => (
                        <Link
                            key={p.id}
                            href={`/projects/${p.id}`}
                            className="group block border border-mocha-surface0 bg-mocha-mantle/50 rounded-lg p-5 hover:border-mocha-blue transition-all hover:translate-y-[-2px] hover:shadow-lg"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h2 className="text-xl font-bold text-mocha-blue group-hover:text-mocha-lavender transition-colors">{p.title}</h2>
                                <span className="text-xs text-mocha-overlay font-mono self-center">view &gt;</span>
                            </div>
                            <p className="text-mocha-subtext mb-4 line-clamp-2">{p.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {p.tech.map((t) => (
                                    <span key={t} className="text-xs px-2 py-1 bg-mocha-surface0 text-mocha-text rounded-md font-mono">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </Link>
                    ))}

                    {filteredProjects.length === 0 && (
                        <div className="col-span-1 md:col-span-2 text-center py-12 text-mocha-overlay">
                            No projects found matching &quot;{filter}&quot;.
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-mocha-surface0 flex justify-between text-sm text-mocha-overlay font-mono">
                <span>Total Projects: {PROJECTS.length}</span>
                <Link href="/" className="hover:text-mocha-text hover:underline">cd ..</Link>
            </div>
        </div>
    );
}
