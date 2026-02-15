"use client";

import { useEffect, useState } from "react";
import { PROFILE } from "@/data/profile";
import { ASCII_ART, STATUS_LINES } from "./constants";

export function AchievementLine({ label }: { label: string }) {
  return (
    <div className="text-xs font-mono text-mocha-overlay">
      achievement unlocked: <span className="text-mocha-yellow">{label}</span>
    </div>
  );
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for environments where Clipboard API is unavailable.
    try {
      const el = document.createElement("textarea");
      el.value = text;
      el.setAttribute("readonly", "");
      el.style.position = "fixed";
      el.style.top = "-9999px";
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(el);
      return ok;
    } catch {
      return false;
    }
  }
}

export function CopyableLink({
  label,
  value,
  openInNewTab,
  suffix,
}: {
  label: string;
  value: string;
  openInNewTab?: boolean;
  suffix?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-x-2 gap-y-1 items-baseline">
        <span className="text-mocha-subtext">{label}:</span>
        {openInNewTab ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            onClick={async () => {
              const ok = await copyToClipboard(value);
              setCopied(ok);
              window.setTimeout(() => setCopied(false), 1200);
            }}
            className="text-mocha-mauve hover:text-mocha-pink underline decoration-mocha-overlay text-left"
            title="Click to open + copy"
          >
            {value}
          </a>
        ) : (
          <button
            type="button"
            onClick={async () => {
              const ok = await copyToClipboard(value);
              setCopied(ok);
              window.setTimeout(() => setCopied(false), 1200);
            }}
            className="text-mocha-mauve hover:text-mocha-pink underline decoration-mocha-overlay text-left"
            title="Click to copy"
          >
            {value}
          </button>
        )}
        {suffix ? <span className="text-mocha-overlay">{suffix}</span> : null}
      </div>
      {copied ? (
        <div className="text-xs font-mono text-mocha-green">copied ✓</div>
      ) : null}
    </div>
  );
}

export function WelcomeBlock({ heading }: { heading: string }) {
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
      <p>
        {PROFILE.name} — {PROFILE.title}
      </p>
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
