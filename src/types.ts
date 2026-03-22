/**
 * TypeScript definitions for git-no-ai-author
 */

export interface AI_PATTERN {
  name: string;
  pattern: string;
}

export interface Config {
  templateDir: string;
  hooksDir: string;
  hookFile: string;
}

export interface InstallOptions {
  force?: boolean;
  silent?: boolean;
}

export interface UninstallOptions {
  removeConfig?: boolean;
  silent?: boolean;
}

export interface HookResult {
  success: boolean;
  message: string;
  path?: string;
}

export const DEFAULT_AI_PATTERNS: readonly AI_PATTERN[] = [
  { name: 'Claude Opus', pattern: '^Co-Authored-By: Claude Opus' },
  { name: 'GitHub Copilot', pattern: '^Co-Authored-By: GitHub Copilot' },
  { name: 'ChatGPT', pattern: '^Co-Authored-By: ChatGPT' },
  { name: 'Anthropic', pattern: '^Co-Authored-By: Anthropic' },
  { name: 'OpenAI', pattern: '^Co-Authored-By: OpenAI' },
  { name: 'Cursor AI', pattern: '^Co-Authored-By: Cursor AI' },
  { name: 'AI Assistant', pattern: '^Co-Authored-By: AI Assistant' },
] as const;
