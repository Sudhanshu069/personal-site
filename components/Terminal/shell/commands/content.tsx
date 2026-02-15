import Link from "next/link";
import { PROJECTS } from "@/data/projects";
import type { CommandContext, CommandResult } from "./types";

function stage(lines: string[]) {
  return (
    <div className="space-y-1 font-mono text-mocha-overlay">
      {lines.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>
  );
}

export function handleProjectsCommand(ctx: CommandContext): CommandResult {
  const { entryId, setHistory, schedule } = ctx;

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

  schedule(() => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === entryId ? { ...item, output: stage(["fetching…", "rendering…"]) } : item
      )
    );
  }, 50);

  schedule(() => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === entryId
          ? { ...item, output: stage(["fetching…", "rendering…", "done."]) }
          : item
      )
    );
  }, 100);

  schedule(() => {
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

  return { output: stage(["fetching…"]) };
}

export function handleBlogCommand(ctx: CommandContext): CommandResult {
  const { entryId, setHistory, schedule, navigateTo } = ctx;

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

  schedule(() => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === entryId ? { ...item, output: stage(["fetching…", "rendering…"]) } : item
      )
    );
  }, 50);

  schedule(() => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === entryId
          ? { ...item, output: stage(["fetching…", "rendering…", "done."]) }
          : item
      )
    );
  }, 100);

  schedule(() => {
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
    navigateTo("/blog");
  }, 150);

  return { output: stage(["fetching…"]) };
}
