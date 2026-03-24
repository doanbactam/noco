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
// Handles whitespace variations: leading whitespace, optional space around colon, tabs/spaces after colon
const AI_PATTERN_REGEX = '^\\s*[Cc][Oo]-[Aa][Uu][Tt][Hh][Oo][Rr][Ee][Dd]-[Bb][Yy]\\s*:\\s*(Claude|GitHub Copilot|ChatGPT|Anthropic|OpenAI|Cursor AI|AI Assistant|Tabnine|CodeWhisperer|Codeium|Replit Ghostwriter|Sourcegraph Cody|Cody|Factory Droid|factory-droid\\[bot\\]|Gemini|Google Gemini|Gemini Pro|Perplexity|Perplexity AI|Amazon Q|Amp|Amp AI).*';

export const DEFAULT_AI_PATTERNS: readonly AI_PATTERN[] = [
  {
    name: 'AI Co-Authors',
    pattern: AI_PATTERN_REGEX,
  },
] as const;

// AI author names to detect and replace (case-insensitive)
export const AI_AUTHOR_NAMES = [
  'claude',
  'claude code',
  'claude opus',
  'claude sonnet',
  'claude haiku',
  'anthropic',
  'github copilot',
  'copilot',
  'chatgpt',
  'openai',
  'cursor ai',
  'cursor',
  'tabnine',
  'codewhisperer',
  'codeium',
  'replit ghostwriter',
  'sourcegraph cody',
  'cody',
  'factory droid',
  'factory-droid',
  'factory-droid[bot]',
  'gemini',
  'google gemini',
  'perplexity',
  'perplexity ai',
  'amazon q',
  'amp',
  'amp ai',
  'ai assistant',
] as const;

export function isAIAuthor(name: string): boolean {
  const lowerName = name.toLowerCase().trim();
  return AI_AUTHOR_NAMES.some(aiName => lowerName.includes(aiName.toLowerCase()));
}
