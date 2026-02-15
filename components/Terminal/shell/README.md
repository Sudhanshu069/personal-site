# Terminal Shell Architecture

This folder contains the shell runtime split into composable units.

## Core Flow

1. `useShellController.tsx` owns input/history/idle/query-param orchestration.
2. `commandExecutor.tsx` owns cross-command rules:
   - achievement progression
   - `help help` manpage special-case
   - history append/wrap behavior
3. `commands/index.ts` dispatches to command handlers.
4. `commands/*` files render command-specific output and side effects.

## Key Files

- `constants.ts`: command lists and terminal copy constants.
- `utils.ts`: pure helpers (ghost hint, suggestion, cowsay formatting).
- `ui.tsx`: shell-specific UI helpers (`WelcomeBlock`, `CopyableLink`, `AchievementLine`).
- `types.ts`: shared shell state and ref typing.

## Safety Notes

- Timed command updates (`projects`, `blog`, pong focus restore) must use `schedule` from `useShellController.tsx`.
- `history` output must be computed from current history state before appending the command entry.
- Keep command text/classnames stable unless intentionally changing UX.
