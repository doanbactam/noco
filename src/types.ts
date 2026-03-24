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

// All AI co-author patterns in one regex - easy to extend
// Matches: Co-Authored-By: <AI-Name> <version> <email> ...
// Uses character classes for case-insensitive matching (portable across sed implementations)
const AI_PATTERN_REGEX = '^[Cc][Oo]-[Aa][Uu][Tt][Hh][Oo][Rr][Ee][Dd]-[Bb][Yy]: (Claude|GitHub Copilot|ChatGPT|Anthropic|OpenAI|Cursor AI|AI Assistant|Tabnine|CodeWhisperer|Codeium|Replit Ghostwriter|Sourcegraph Cody|Cody|Factory Droid|factory-droid\\[bot\\]|Gemini|Google Gemini|Gemini Pro|Perplexity|Perplexity AI|Amazon Q|Amp|Amp AI).*';

export const DEFAULT_AI_PATTERNS: readonly AI_PATTERN[] = [
  {
    name: 'AI Co-Authors',
    pattern: AI_PATTERN_REGEX,
  },
] as const;
