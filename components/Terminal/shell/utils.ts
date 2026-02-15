import { COMMAND_HINTS, SUGGESTION_COMMANDS } from "./constants";

export function getGhostHint(rawInput: string) {
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

function levenshtein(a: string, b: string) {
  if (a === b) return 0;
  if (!a) return b.length;
  if (!b) return a.length;

  const m = a.length;
  const n = b.length;

  // dp over the shorter string
  if (n > m) return levenshtein(b, a);

  let prev = new Array(n + 1).fill(0).map((_, i) => i);
  let curr = new Array(n + 1).fill(0);

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    const ca = a.charCodeAt(i - 1);
    for (let j = 1; j <= n; j++) {
      const cost = ca === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1, // deletion
        curr[j - 1] + 1, // insertion
        prev[j - 1] + cost // substitution
      );
    }
    [prev, curr] = [curr, prev];
  }

  return prev[n];
}

export function suggestCommand(rawInput: string) {
  const input = rawInput.trim().toLowerCase();
  if (!input) return null;
  if (input.includes(" ")) return null;
  if (input.length < 3) return null;

  const maxDist = input.length <= 4 ? 1 : 2;

  let best: { cmd: string; dist: number } | null = null;
  let secondBestDist = Number.POSITIVE_INFINITY;

  for (const cmd of SUGGESTION_COMMANDS) {
    if (cmd === input) return null;
    const dist = levenshtein(input, cmd);
    if (dist < (best?.dist ?? Number.POSITIVE_INFINITY)) {
      secondBestDist = best?.dist ?? Number.POSITIVE_INFINITY;
      best = { cmd, dist };
    } else if (dist < secondBestDist) {
      secondBestDist = dist;
    }
  }

  if (!best) return null;
  if (best.dist > maxDist) return null;
  if (secondBestDist === best.dist) return null; // ambiguous suggestion

  return best.cmd;
}

export function getDayOfYear(d = new Date()) {
  // Use UTC so "per day" doesn't shift by local timezone quirks.
  const y = d.getUTCFullYear();
  const start = Date.UTC(y, 0, 0);
  const now = Date.UTC(y, d.getUTCMonth(), d.getUTCDate());
  return Math.floor((now - start) / 86400000);
}

function wrapText(text: string, maxWidth: number) {
  const s = text.trim();
  if (!s) return [""];

  const words = s.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const w of words) {
    if (!current) {
      current = w;
      continue;
    }

    if ((current + " " + w).length <= maxWidth) {
      current += " " + w;
      continue;
    }

    lines.push(current);
    current = w;
  }

  if (current) lines.push(current);
  return lines.length ? lines : [s];
}

export function renderCowsay(message: string) {
  const lines = wrapText(message, 46);
  const width = Math.max(...lines.map((l) => l.length));

  const top = " " + "_".repeat(width + 2);
  const bottom = " " + "-".repeat(width + 2);

  const bubble =
    lines.length === 1
      ? [`< ${lines[0].padEnd(width, " ")} >`]
      : lines.map((l, idx) => {
          const padded = l.padEnd(width, " ");
          if (idx === 0) return `/ ${padded} \\`;
          if (idx === lines.length - 1) return `\\ ${padded} /`;
          return `| ${padded} |`;
        });

  const cow = [
    "        \\   ^__^",
    "         \\  (oo)\\_______",
    "            (__)\\       )\\/\\",
    "                ||----w |",
    "                ||     ||",
  ];

  return [top, ...bubble, bottom, ...cow].join("\n");
}
