export const ASCII_ART = `
   _____           _ _
  / ____|         | | |
 | (___  _   _  __| | |__   __ _ _ __  ___| |__  _   _
  \\___ \\| | | |/ _\` | '_ \\ / _\` | '_ \\/ __| '_ \\| | | |
  ____) | |_| | (_| | | | | (_| | | | \\__ \\ | | | |_| |
 |_____/ \\__,_|\\__,_|_| |_|\\__,_|_| |_|___/_| |_|\\__,_|
`;

export const COMMANDS = [
  "help",
  "about",
  "experience",
  "projects",
  "blog",
  "contact",
  "resume",
  "pong",
  "clear",
  "welcome",
  "history",
  "pwd",
];

export const SUGGESTION_COMMANDS = Array.from(
  new Set([
    ...COMMANDS,
    // aliases supported by the switch
    "ls",
    "skills",
    "writing",
    "email",
    "socials",
    "whoami",
    "q",
  ])
);

export const STATUS_LINES = [
  "Status: prod-safe (probably)",
  "Mood: shipping",
  "Latency: sub-500ms on good days",
  "Uptime: 99.9% (in my dreams)",
  "Warning: may contain semicolons",
  "Tip: type 'pong' if you came here to procrastinate",
] as const;

export const ROAST_LITE_LINES = [
  "Nice try.",
  "That’s not a thing (yet).",
  "404: command missing.",
  "that command is in staging.",
] as const;

export const COMMAND_HINTS: Record<string, string> = {
  experience: "skills + work + impact",
  projects: "featured builds",
  resume: "full PDF",
  contact: "email + socials",
  blog: "posts",
};

export const COWSAY_LINES = [
  // DevOps / Infra vibes
  "I deploy on Fridays. I also enjoy pain.",
  "If it's not monitored, it's not real.",
  "My favorite feature is rollback.",
  "Works on my machine is not a deployment strategy.",
  "Auto-scaling is cool until the bill auto-scales too.",
  "99.9% uptime is still 43 minutes of chaos per month.",
  "The incident isn’t over until the postmortem exists.",
  "Idempotency: because humans double-click.",
  "Cache invalidation is my cardio.",
  "Minimal UI. Maximum keyboard.",
  "Idempotency: because humans double-click.",
  "Cache invalidation is my cardio.",
  "Retries are love. Retries are pain.",
  "Distributed systems: where maybe becomes a feature.",
  "Every request is a mystery until the trace shows up.",
  "Latency is a tax. I try not to pay it.",
  "If it’s event-driven, it’s also event-debugging.",
  "I speak fluent HTTP. And occasional gRPC.",
  "The bug is in the edge case. It’s always the edge case.",
  "Unknown command? Sounds like a feature request",
  "I can’t fix your prod, but I can fix your CI.",
  "Be nice to alerts. They’re trying their best.",
  "Congratulations, you found the cow.",
  "99.9% uptime is still 43 minutes of chaos per month.",
] as const;

export const IDLE_LINES = [
  "psst… type 'pong' if you're bored.",
  "still there? your CPU misses you.",
  "idle detected. running: nothing.",
  "keyboard timeout… press any key to resume existence.",
  "if you’re stuck, try 'help' (I won’t judge).",
  "fun fact: uptime increases even when you don’t.",
  "this is the part where you type 'projects'.",
  "brb, pretending to be a real shell…",
  "no input for 20s. mood: suspiciously calm.",
  "type 'resume' to drop the PDF like it’s hot.",
] as const;
