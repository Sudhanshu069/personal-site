import { PROFILE } from "@/data/profile";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="h-full flex flex-col p-4 md:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-mocha-surface1">
            <div className="max-w-3xl">
                <h1 className="text-3xl font-bold text-mocha-mauve mb-4">About Me</h1>

                <div className="prose prose-invert prose-mocha mb-8">
                    <p className="text-mocha-text text-lg leading-relaxed">
                        Hello! I&apos;m <span className="text-mocha-blue font-bold">{PROFILE.name}</span>, a {PROFILE.tagline} based in {PROFILE.location}.
                    </p>
                    <p className="text-mocha-subtext">
                        I love building tools that empower developers and crafting user interfaces that feel like magic.
                        When I&apos;m not coding, I&apos;m probably tweaking my Neovim config or exploring new coffee shops.
                    </p>
                </div>

                <h2 className="text-2xl font-bold text-mocha-yellow mb-4">Experience</h2>
                <div className="space-y-6 mb-8">
                    {PROFILE.experience.map((exp, i) => (
                        <div key={i} className="border-l-2 border-mocha-surface1 pl-4">
                            <h3 className="text-xl font-bold text-mocha-text">{exp.role}</h3>
                            <div className="flex justify-between items-center text-sm text-mocha-overlay mb-2">
                                <span>
                                    {exp.company}
                                    {exp.location ? <span className="text-mocha-surface2"> • {exp.location}</span> : null}
                                </span>
                                <span>{exp.period}</span>
                            </div>
                            <ul className="list-disc pl-5 space-y-1 text-mocha-subtext">
                                {exp.highlights.map((h) => (
                                    <li key={h}>{h}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <h2 className="text-2xl font-bold text-mocha-green mb-4">Tech Stack</h2>
                <div className="flex flex-wrap gap-2 mb-8">
                    {PROFILE.skills.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-mocha-surface0 text-mocha-text rounded-md border border-mocha-surface1 font-mono text-sm">
                            {skill}
                        </span>
                    ))}
                </div>

                <div className="pt-8 border-t border-mocha-surface0">
                    <Link href="/contact" className="text-mocha-blue hover:underline">
                        Get in touch -&gt;
                    </Link>
                </div>
            </div>
        </div>
    );
}
