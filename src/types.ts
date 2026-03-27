/**
 * TypeScript definitions for nococli
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

// AI co-author patterns — two layers of detection:
// 1. Name-based: matches known AI names after "Co-Authored-By:"
// 2. Email-based: matches known AI email domains (more precise, fewer false positives)
// Both use JS RegExp with 'i' flag for case-insensitive matching (cross-platform, no sed needed)

const AI_NAME_PATTERN =
  '^\\s*Co-Authored-By\\s*:\\s*(Claude|GitHub Copilot|ChatGPT|Anthropic|OpenAI|Cursor AI|AI Assistant|Tabnine|CodeWhisperer|Codeium|Replit Ghostwriter|Sourcegraph Cody|Cody|Factory Droid|factory-droid\\[bot\\]|Gemini|Google Gemini|Gemini Pro|Perplexity|Perplexity AI|Amazon Q|Amp|Amp AI).*';

// Email domains used by AI tools — matches regardless of the name
const AI_EMAIL_PATTERN =
  '^\\s*Co-Authored-By\\s*:\\s*.*\\b(?:noreply@anthropic\\.com|claude@anthropic\\.com|copilot@github\\.com|chatgpt@openai\\.com|noreply@openai\\.com|cursor@cursor\\.sh|tabnine@tabnine\\.com|codewhisperer@amazon\\.com|codeium@codeium\\.com|ghostwriter@replit\\.com|cody@sourcegraph\\.com|\\d+\\+factory-droid\\[bot\\]@users\\.noreply\\.github\\.com|gemini@google\\.com|perplexity@perplexity\\.ai|q@amazon\\.com|amp@amp\\.ai)\\b.*';

export const DEFAULT_AI_PATTERNS: readonly AI_PATTERN[] = [
  { name: 'AI Co-Author Names', pattern: AI_NAME_PATTERN },
  { name: 'AI Co-Author Emails', pattern: AI_EMAIL_PATTERN },
] as const;

// AI author names to detect in git config (case-insensitive)
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
  return AI_AUTHOR_NAMES.some((aiName) => lowerName.includes(aiName.toLowerCase()));
}
