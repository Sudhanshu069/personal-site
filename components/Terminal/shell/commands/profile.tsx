import { PROFILE } from "@/data/profile";
import { CopyableLink } from "../ui";
import type { CommandContext, CommandResult } from "./types";

export function handleAboutCommand(): CommandResult {
  return {
    output: (
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
    ),
  };
}

export function handleExperienceCommand(): CommandResult {
  return {
    output: (
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
    ),
  };
}

export function handleContactCommand(): CommandResult {
  return {
    output: (
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
    ),
  };
}

export function handleEmailSocialsAliasCommand(): CommandResult {
  return {
    output: (
      <div className="text-mocha-subtext">
        Use <span className="text-mocha-yellow">contact</span>.
      </div>
    ),
  };
}

export function handleResumeCommand(ctx: CommandContext): CommandResult {
  ctx.openInNewTab("/resume.pdf");

  return {
    output: (
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
    ),
  };
}
