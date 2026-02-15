import {
  handleAboutCommand,
  handleContactCommand,
  handleEmailSocialsAliasCommand,
  handleExperienceCommand,
  handleResumeCommand,
} from "./profile";
import { handleBlogCommand, handleProjectsCommand } from "./content";
import { handleHelpCommand } from "./help";
import {
  handleClearCommand,
  handleCowsayCommand,
  handleEmptyCommand,
  handleHistoryCommand,
  handlePongCommand,
  handlePwdCommand,
  handleUnknownCommand,
  handleWelcomeCommand,
  handleWhoamiCommand,
} from "./system";
import type { CommandHandler, CommandContext, CommandResult } from "./types";

const COMMAND_REGISTRY: Record<string, CommandHandler> = {
  welcome: handleWelcomeCommand,
  ls: handleHelpCommand,
  help: handleHelpCommand,
  about: handleAboutCommand,
  cowsay: handleCowsayCommand,
  experience: handleExperienceCommand,
  skills: handleExperienceCommand,
  projects: handleProjectsCommand,
  blog: handleBlogCommand,
  writing: handleBlogCommand,
  contact: handleContactCommand,
  email: handleEmailSocialsAliasCommand,
  socials: handleEmailSocialsAliasCommand,
  resume: handleResumeCommand,
  pong: handlePongCommand,
  history: handleHistoryCommand,
  whoami: handleWhoamiCommand,
  pwd: handlePwdCommand,
  q: handleClearCommand,
  clear: handleClearCommand,
  "": handleEmptyCommand,
};

export function executeRegisteredCommand(ctx: CommandContext): CommandResult {
  const handler = COMMAND_REGISTRY[ctx.effectiveCmd];
  if (handler) return handler(ctx);
  return handleUnknownCommand(ctx);
}
